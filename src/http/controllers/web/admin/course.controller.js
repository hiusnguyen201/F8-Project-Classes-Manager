const createHttpError = require("http-errors");
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
  index: async (req, res) => {
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

    const [{ count, rows }] = await courseService.countAllCourse(filters);

    if (!limit) {
      limit = 10;
    } else {
      if (+limit === 25 || +limit === 50 || +limit === 100) {
        limit = +limit;
      } else {
        limit = 10;
      }
    }

    const totalPage = Math.ceil(count / limit);
    if (page < 1 || !page) {
      page = 1;
    } else if (page > totalPage) {
      page = totalPage;
    }
    const offset = (page - 1) * +limit;

    return res.render(RENDER_PATH.HOME_COURSES_ADMIN, {
      req,
      user: req.user,
      page,
      title: `Manage Courses - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount: count,
      currPage: "courses",
      offset,
      limit,
      courses: rows.slice(+offset, +offset + limit) ?? [],
      totalPage,
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
      stringUtil,
    });
  },

  create: async (req, res) => {
    const [teachers] = await userService.getAllUser(["teacher"]);

    return res.render(RENDER_PATH.CREATE_COURSE, {
      req,
      user: req.user,
      teachers,
      oldValues: req.flash("oldValues")[0] ?? {},
      errorsValidate: stringUtil.extractErr(req.flash("errors")),
      title: `Create course - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      currPage: "courses",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleCreateCourse: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("oldValues", req.body);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.CREATE_COURSE);
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

    return res.redirect(REDIRECT_PATH.CREATE_COURSE);
  },

  edit: async (req, res, next) => {
    const { id } = req.params;

    const [teachers] = await userService.getAllUser(["teacher"]);

    const { errors } = validationResult(req);
    if (errors?.length) {
      return next(createHttpError(404));
    }

    const [courseEdit] = await courseService.getCourse({
      id,
    });

    return res.render(RENDER_PATH.EDIT_COURSE, {
      req,
      user: req.user,
      teachers,
      oldValues: req.flash("oldValues")[0] ?? courseEdit ?? {},
      errorsValidate: stringUtil.extractErr(req.flash("errors")),
      title: `Edit course - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      currPage: "courses",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleEditCourse: async (req, res) => {
    const { id } = req.params;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("errors", errors);
      req.flash("oldValues", req.body);
      return res.redirect(REDIRECT_PATH.EDIT_COURSE + `/${id}`);
    }

    const { name, price, teacherId, tryLearn, quantity, duration } = req.body;
    const [status, message] = await courseService.updateCourse(
      +id,
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

    return res.redirect(REDIRECT_PATH.EDIT_COURSE + `/${id}`);
  },

  handleDeleteCourses: async (req, res) => {
    const { id } = req.body;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.HOME_COURSES_ADMIN);
    }

    const [status, message] = await courseService.removeCourses(
      Array.isArray(id) ? id : [id]
    );
    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
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
      return res.redirect(REDIRECT_PATH.HOME_COURSES_ADMIN);
    }

    fileExcel.writeFile(
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
