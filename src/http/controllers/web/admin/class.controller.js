const createHttpError = require("http-errors");
const moment = require("moment");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
  MESSAGE_INFO,
} = require("../../../../constants/message.constant");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const { STATUS_CODE } = require("../../../../constants/status.constant");
const {
  FIELDS_IMPORT,
  FILE_NAME_EXPORT,
  SHEET_HEADERS_EXPORT,
} = require("../../../../constants/fileExcel.constant");

const csrf = require("../../../middlewares/web/csrf.middleware");

const stringUtil = require("../../../../utils/string");
const { writeFile } = require("../../../../utils/fileExcel");

const ClassService = require("../../../services/class.service");
const classService = new ClassService();
const CourseService = require("../../../services/course.service");
const courseService = new CourseService();
const UserService = require("../../../services/user.service");
const userService = new UserService();

module.exports = {
  index: async (req, res, next) => {
    try {
      const { meta, data: classes } =
        await classService.findAllWithSearchAndPaginate(req.query);

      return res.render(RENDER_PATH.ADMIN.HOME_CLASSES, {
        req,
        user: req.user,
        page: meta.page,
        title: `Manage Classes - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        totalCount: meta.count,
        offset: meta.offset,
        limit: meta.limit,
        currPage: "classes",
        classes,
        totalPage: meta.totalPage,
        success: req.flash("success"),
        error: req.flash("error"),
        stringUtil,
        csrf,
        moment,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  create: async (req, res) => {
    try {
      const courses = await courseService.findAll();
      const assistants = await userService.findAllWithTypes(["assistant"]);

      return res.render(RENDER_PATH.ADMIN.CREATE_CLASS, {
        stringUtil,
        user: req.user,
        daysOfWeek: moment.weekdays(),
        oldValues: req.flash("oldValues")[0] || {},
        errorsValidate: req.flash("errors")[0] || {},
        courses,
        assistants,
        title: `Create Class - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        currPage: "classes",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleCreateClass: async (req, res) => {
    try {
      await classService.create(req.body);
      req.flash("success", MESSAGE_SUCCESS.CLASS.CREATE_CLASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.CLASS.CREATE_CLASS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.CREATE_CLASS);
  },

  edit: async (req, res, next) => {
    try {
      const courses = await courseService.findAll();
      const assistants = await userService.findAllWithTypes("assistant");
      const oldValues = req.flash("oldValues")[0];

      if (oldValues) {
        oldValues.timeLearn = "";
        if (oldValues.schedule?.length) {
          oldValues.schedule.forEach((schedule, i) => {
            oldValues.timeLearn += `${oldValues.timeLearnStart[i]} - ${oldValues.timeLearnEnd[i]}`;
            if (oldValues.schedule.length != i) {
              oldValues.timeLearn += ",";
            }
          });
        } else {
          oldValues.timeLearn = `${oldValues.timeLearnStart} - ${oldValues.timeLearnEnd}`;
        }
      }

      const classObj = await classService.findByName(req.params.name);
      const listClassTeacher = classObj.Users.map((user) => user.id);

      return res.render(RENDER_PATH.ADMIN.EDIT_CLASS, {
        csrf,
        stringUtil,
        user: req.user,
        moment,
        daysOfWeek: moment.weekdays(),
        success: req.flash("success"),
        error: req.flash("error"),
        REDIRECT_PATH,
        oldValues: oldValues ?? classObj ?? {},
        courses,
        assistants,
        listClassTeacher,
        title: `Edit Class - ${process.env.APP_NAME}`,
        currPage: "classes",
        errorsValidate: stringUtil.extractErr(req.flash("errors")),
        moment,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.NOT_FOUND));
    }
  },

  handleEditClass: async (req, res) => {
    const { name } = req.params;
    try {
      await classService.update(req.body, name);
      req.flash("success", MESSAGE_SUCCESS.CLASS.EDIT_CLASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.CLASS.EDIT_CLASS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.EDIT_CLASS + `/${name}`);
  },

  handleDeleteClasses: async (req, res) => {
    try {
      const { id } = req.body;
      await classService.removeClasses(Array.isArray(id) ? id : [id]);
      req.flash("success", MESSAGE_SUCCESS.CLASS.DELETE_CLASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.CLASS.DELETE_CLASS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.HOME_CLASSES);
  },
  importClassesPage: async (req, res) => {},
  handleImportClasses: async (req, res) => {},
  handleExportClasses: async (req, res) => {},
};
