const createHttpError = require("http-errors");
const moment = require("moment");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
  MESSAGE_INFO,
} = require("../../../../constants/message.constant");
const { STATUS_CODE } = require("../../../../constants/status.constant");
const {
  FILE_NAME_EXPORT,
  SHEET_HEADERS_EXPORT,
  FIELDS_IMPORT,
} = require("../../../../constants/fileExcel.constant");

const stringUtil = require("../../../../utils/string");
const { writeFile } = require("../../../../utils/fileExcel");

const csrf = require("../../../middlewares/web/csrf.middleware");

const CourseService = require("../../../services/course.service");
const courseService = new CourseService();
const UserService = require("../../../services/user.service");
const userService = new UserService();

module.exports = {
  index: async (req, res) => {
    try {
      const { meta, data: courses } =
        await courseService.findAllWithSearchAndPaginate(req.query);

      return res.render(RENDER_PATH.ADMIN.HOME_COURSES, {
        req,
        user: req.user,
        page: meta.page,
        title: `Manage Courses`,
        REDIRECT_PATH,
        totalCount: meta.count,
        offset: meta.offset,
        limit: meta.limit,
        currPage: "courses",
        courses,
        breadcrumb: {
          items: ["Dashboard", "Courses"],
          paths: [REDIRECT_PATH.ADMIN.HOME_ADMIN],
        },
        totalPage: meta.totalPage,
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
        stringUtil,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  create: async (req, res) => {
    try {
      const teachers = await userService.findAllWithTypes("teacher");

      return res.render(RENDER_PATH.ADMIN.CREATE_COURSE, {
        req,
        user: req.user,
        teachers,
        oldValues: req.flash("oldValues")[0] || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Create course`,
        REDIRECT_PATH,
        currPage: "courses",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  async details(req, res, next) {
    try {
      const course = await courseService.findById(req.params.id);
      if (!course) {
        return next(createHttpError(STATUS_CODE.NOT_FOUND));
      }

      return res.render(RENDER_PATH.ADMIN.DETAILS_COURSE, {
        req,
        user: req.user,
        title: `Details Course`,
        REDIRECT_PATH,
        currPage: "courses",
        course,
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
        stringUtil,
        moment,
        breadcrumb: {
          items: ["Dashboard", "Courses", "Details"],
          paths: [
            REDIRECT_PATH.ADMIN.HOME_ADMIN,
            REDIRECT_PATH.ADMIN.HOME_COURSES,
          ],
        },
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleCreateCourse: async (req, res) => {
    try {
      await courseService.create(req.body);
      req.flash("success", MESSAGE_SUCCESS.COURSE.CREATE_COURSE_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.COURSE.CREATE_COURSE_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  edit: async (req, res, next) => {
    try {
      const courseEdit = await courseService.findById(req.params.id);
      if (!courseEdit) throw new Error(MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND);

      const teachers = await userService.findAllWithTypes(["teacher"]);

      return res.render(RENDER_PATH.ADMIN.EDIT_COURSE, {
        req,
        user: req.user,
        teachers,
        oldValues: req.flash("oldValues")[0] || courseEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Edit course`,
        REDIRECT_PATH,
        currPage: "courses",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.NOT_FOUND));
    }
  },

  handleEditCourse: async (req, res) => {
    const { id } = req.params;
    try {
      await courseService.update(req.body, id);
      req.flash("success", MESSAGE_SUCCESS.COURSE.EDIT_COURSE_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.COURSE.EDIT_COURSE_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  handleDeleteCourses: async (req, res) => {
    try {
      const { id } = req.body;
      await courseService.removeCourses(Array.isArray(id) ? id : [id]);
      req.flash("success", MESSAGE_SUCCESS.COURSE.DELETE_COURSE_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.COURSE.DELETE_COURSE_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  importCoursesPage: async (req, res) => {
    return res.render(RENDER_PATH.ADMIN.IMPORT_COURSES, {
      title: `Import Courses`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "courses",
      error: req.flash("error"),
      success: req.flash("success"),
      breadcrumb: {
        items: ["Dashboard", "Courses", "Import"],
        paths: [
          REDIRECT_PATH.ADMIN.HOME_ADMIN,
          REDIRECT_PATH.ADMIN.HOME_COURSES,
        ],
      },
    });
  },

  handleImportCourses: async (req, res) => {
    try {
      await courseService.importCourses(
        req.files[0],
        FIELDS_IMPORT.COURSE_FIELDS
      );
      req.flash("success", MESSAGE_SUCCESS.FILE.IMPORT_COURSES_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.IMPORT_COURSES_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  handleExportCourses: async (req, res) => {
    try {
      const courses = await courseService.findAll();

      if (!courses?.length) throw new Error(MESSAGE_INFO.FILE.NOTHING_EXPORT);

      writeFile(
        res,
        SHEET_HEADERS_EXPORT.HEADERS_COURSE,
        FILE_NAME_EXPORT.COURSE,
        (sheet) => {
          courses.forEach(
            ({ name, price, User, tryLearn, quantity, duration }) => {
              sheet.addRow({
                name,
                price,
                teacher: User.email,
                tryLearn,
                quantity,
                duration,
              });
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.EXPORT_COURSES_FAILED);
      return res.redirect(req.originalUrl);
    }
  },

  createModule: async (req, res) => {
    return res.render(RENDER_PATH.ADMIN.CREATE_MODULE, {
      req,
      user: req.user,
      oldValues: req.flash("oldValues")[0] || {},
      errorsValidate: req.flash("errors")[0] || {},
      title: `Create module`,
      REDIRECT_PATH,
      courseId: req.params.id,
      currPage: "modules",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  editModule: async (req, res) => {
    const module = await courseService.getModuleById(req.params.moduleId);
    if (!module) return next(createHttpError(STATUS_CODE.NOT_FOUND));

    return res.render(RENDER_PATH.ADMIN.EDIT_MODULE, {
      req,
      user: req.user,
      errorsValidate: req.flash("errors")[0] || {},
      oldValues: req.flash("oldValues")[0] || module || {},
      title: `Edit module`,
      REDIRECT_PATH,
      module,
      courseId: req.params.id,
      currPage: "modules",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleCreateModule: async (req, res) => {
    try {
      await courseService.createModule(req.body, req.files, req.params.id);
      req.flash("success", MESSAGE_SUCCESS.COURSE.CREATE_MODULE_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.COURSE.CREATE_MODULE_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  handleEditModule: async (req, res) => {
    try {
      await courseService.editModule(req.body, req.files, req.params.moduleId);
      req.flash("success", MESSAGE_SUCCESS.COURSE.EDIT_MODULE_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("modalEditModule", true);
      req.flash("error", MESSAGE_ERROR.COURSE.EDIT_MODULE_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  handleDeleteModules: async (req, res) => {
    const { id, moduleId } = req.params;
    try {
      await courseService.removeModules(
        Array.isArray(moduleId) ? moduleId : [moduleId]
      );
      req.flash("success", MESSAGE_SUCCESS.COURSE.DELETE_MODULE_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.COURSE.DELETE_MODULE_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.DETAILS_COURSE + `/${id}`);
  },
};
