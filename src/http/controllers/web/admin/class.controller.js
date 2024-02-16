const { validationResult } = require("express-validator");
const moment = require("moment");

const { Op } = require("sequelize");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const {
  FIELDS_IMPORT,
  FILE_NAME_EXPORT,
  SHEET_HEADERS_EXPORT,
} = require("../../../../constants/fileExcel.constant");

const stringUtil = require("../../../../utils/string");
const fileExcel = require("../../../../utils/fileExcel");

const csrf = require("../../../middlewares/web/csrf.middleware");
const classService = require("../../../services/class.service");
const courseService = require("../../../services/course.service");
const userService = require("../../../services/user.service");

module.exports = {
  index: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");
    let { page, limit, keyword } = req.query;

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

    const [totalCount] = await classService.countAllClass(filters);
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

    const [classes] = await classService.getAllClass(filters, offset, limit);
    const [courses] = await courseService.getAllCourse(null, [["name", "ASC"]]);
    const [assistants] = await userService.getAllUser(["assistant"]);
    const daysOfWeek = moment.weekdays();

    const oldValues = req.flash("oldValues");
    const errorsValidate = req.flash("errors");
    const modalCreate = req.flash("modalCreate")[0];
    const modalUpdate = req.flash("modalUpdate")[0];

    return res.render(RENDER_PATH.HOME_ADMIN_CLASSES, {
      req,
      modalCreate,
      modalUpdate,
      daysOfWeek,
      user: req.user,
      page,
      classes: classes ?? [],
      oldValues: oldValues[0] ?? {},
      errorsValidate,
      title: `Manage Classes - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount,
      currPage: "classes",
      assistants,
      offset,
      courses,
      limit,
      totalPage,
      success,
      error,
      stringUtil,
      csrf,
    });
  },

  handleCreateClass: async (req, res) => {
    // const { errors } = validationResult(req);
    // if (errors?.length) {
    //   req.flash("modalCreate", true);
    //   req.flash("oldValues", req.body);
    //   req.flash("errors", errors);
    //   return res.redirect(REDIRECT_PATH.CLASSES_ADMIN);
    // }
    // const {
    //   name,
    //   quantity,
    //   startDate,
    //   schedule,
    //   timeLearnStart,
    //   timeLearnEnd,
    //   courseId,
    //   assistantId,
    // } = req.body;
    // const timeLearn = `${timeLearnStart} - ${timeLearnEnd}`;
    // const [newClass, message] = await classService.createClass(
    //   name,
    //   quantity,
    //   startDate,
    //   schedule,
    //   timeLearn,
    //   courseId,
    //   assistantId
    // );
    // return res.redirect(REDIRECT_PATH.CLASSES_ADMIN);
  },

  handleUpdateClass: async (req, res) => {},
  handleDeleteClasses: async (req, res) => {},
  importClassesPage: async (req, res) => {},
  handleImportClasses: async (req, res) => {},
  handleExportClasses: async (req, res) => {},
};
