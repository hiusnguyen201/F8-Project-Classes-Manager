const { validationResult } = require("express-validator");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const {
  FILE_NAME_EXPORT,
  SHEET_HEADERS_EXPORT,
} = require("../../../../constants/fileExcel.constant");

const stringUtil = require("../../../../utils/string");
const fileExcel = require("../../../../utils/fileExcel");

const csrf = require("../../../middlewares/web/csrf.middleware");

const courseService = require("../../../services/course.service");
const userService = require("../../../services/user.service");

module.exports = {
  // Page
  index: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");
    let { keyword, page, limit = 10 } = req.query;

    const filters = {};
    if (keyword) {
      filters[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    const [totalCount] = await courseService.countAllCourse(filters);

    if (!limit) {
      limit = 10;
    } else {
      if (+limit === 25 || +limit === 50 || +limit === 100) {
        limit = +limit;
      } else {
        limit = 10;
      }
    }

    const totalPage = Math.ceil(totalCount / limit);
    if (page < 1 || !page) {
      page = 1;
    } else if (page > totalPage) {
      page = totalPage;
    }
    const offset = (page - 1) * +limit;

    const [courses] = await courseService.getAllCourse(
      filters,
      null,
      offset,
      limit
    );
    const [teachers] = await userService.getAllUser(["teacher"]);

    const oldValues = req.flash("oldValues");
    const errorsValidate = req.flash("errors");
    const modalCreate = req.flash("modalCreate")[0];
    const modalUpdate = req.flash("modalUpdate")[0];

    return res.render(RENDER_PATH.HOME_ADMIN_COURSES, {
      req,
      modalCreate,
      modalUpdate,
      user: req.user,
      page,
      teachers,
      oldValues: oldValues[0] ?? {},
      errorsValidate,
      title: `Manage Courses - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount,
      currPage: "courses",
      offset,
      limit,
      courses: courses ?? [],
      totalPage,
      success,
      error,
      stringUtil,
      csrf,
    });
  },

  importCoursesPage: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    return res.render(RENDER_PATH.ADMIN_IMPORT_COURSES, {
      title: `Import Courses - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "courses",
      error,
      success,
    });
  },

  // Handle
  handleCreateCourse: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("modalCreate", true);
      req.flash("oldValues", req.body);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.COURSES_ADMIN);
    }

    const { name, price, teacherId, tryLearn, quantity, duration } = req.body;

    const [status, message] = await courseService.createCourse(
      name,
      price,
      +teacherId,
      +tryLearn,
      +quantity,
      duration
    );

    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }

    return res.redirect(REDIRECT_PATH.COURSES_ADMIN);
  },

  handleUpdateCourse: async (req, res) => {
    const { courseId } = req.body;
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("modalUpdate", courseId);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.COURSES_ADMIN);
    }

    const { name, price, teacherId, tryLearn, quantity, duration } = req.body;
    const [status, message] = await courseService.updateCourse(
      +courseId,
      name,
      price,
      teacherId,
      tryLearn,
      quantity,
      duration
    );

    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }

    return res.redirect(REDIRECT_PATH.COURSES_ADMIN);
  },

  handleDeleteCourses: async (req, res) => {
    const { courseId } = req.body;
    let arrId = courseId.split(",");
    arrId = arrId.map((id) => parseInt(id));

    const [status, message] = await courseService.removeCourses(arrId);
    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }

    return res.redirect(REDIRECT_PATH.COURSES_ADMIN);
  },

  handleImportCourses: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.IMPORT_COURSES);
    }

    const [status, message] = await courseService.importCourses(req.file);
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.IMPORT_COURSES);
  },

  handleExportCourses: async (req, res) => {
    const [courses, message] = await courseService.getAllCourse();
    if (!courses) {
      req.flash("error", message);
      return res.redirect(REDIRECT_PATH.COURSES_ADMIN);
    }

    fileExcel.handleExportFile(
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
  },
};
