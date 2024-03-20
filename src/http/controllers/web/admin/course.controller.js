const createHttpError = require("http-errors");
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

      return res.render(RENDER_PATH.HOME_COURSES_ADMIN, {
        req,
        user: req.user,
        page: meta.page,
        title: `Manage Courses - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        totalCount: meta.count,
        offset: meta.offset,
        limit: meta.limit,
        currPage: "courses",
        courses,
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

      return res.render(RENDER_PATH.CREATE_COURSE, {
        req,
        user: req.user,
        teachers,
        oldValues: req.flash("oldValues")[0] || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Create course - ${process.env.APP_NAME}`,
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

  handleCreateCourse: async (req, res) => {
    try {
      await courseService.create(req.body);
      req.flash("success", MESSAGE_SUCCESS.COURSE.CREATE_COURSE_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.COURSE.CREATE_COURSE_FAILED);
    }

    return res.redirect(REDIRECT_PATH.CREATE_COURSE);
  },

  edit: async (req, res, next) => {
    try {
      const courseEdit = await courseService.findById(req.params.id);
      if (!courseEdit) throw new Error(MESSAGE_ERROR.COURSE.COURSE_NOT_FOUND);

      const teachers = await userService.findAllWithTypes(["teacher"]);

      return res.render(RENDER_PATH.EDIT_COURSE, {
        req,
        user: req.user,
        teachers,
        oldValues: req.flash("oldValues")[0] || courseEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Edit course - ${process.env.APP_NAME}`,
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

    return res.redirect(REDIRECT_PATH.EDIT_COURSE + `/${id}`);
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

    return res.redirect(REDIRECT_PATH.HOME_COURSES_ADMIN);
  },

  importCoursesPage: async (req, res) => {
    return res.render(RENDER_PATH.IMPORT_COURSES, {
      title: `Import Courses - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "courses",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },

  handleImportCourses: async (req, res) => {
    try {
      await courseService.importCourses(req.file, FIELDS_IMPORT.COURSE_FIELDS);
      req.flash("success", MESSAGE_SUCCESS.FILE.IMPORT_COURSES_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.IMPORT_COURSES_FAILED);
    }

    return res.redirect(REDIRECT_PATH.IMPORT_COURSES);
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
      return res.redirect(REDIRECT_PATH.HOME_COURSES_ADMIN);
    }
  },
};
