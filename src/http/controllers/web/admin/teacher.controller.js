const createHttpError = require("http-errors");
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
const moment = require("moment");

const csrf = require("../../../middlewares/web/csrf.middleware");

const stringUtil = require("../../../../utils/string");
const { writeFile } = require("../../../../utils/fileExcel");

const UserService = require("../../../services/user.service");
const userService = new UserService();
const TypeService = require("../../../services/type.service");
const typeService = new TypeService();
const ClassService = require("../../../services/class.service");
const classService = new ClassService();

module.exports = {
  index: async (req, res) => {
    try {
      const { meta, data: teachers } =
        await userService.findAllWithTypesAndSearchAndPaginate(req.query, [
          "teacher",
          "assistant",
        ]);

      return res.render(RENDER_PATH.ADMIN.HOME_TEACHERS, {
        req,
        user: req.user,
        page: meta.page,
        title: `Manage Teachers`,
        REDIRECT_PATH,
        totalCount: meta.count,
        offset: meta.offset,
        limit: meta.limit,
        currPage: "teachers",
        teachers,
        breadcrumb: {
          items: ["Home", "Teachers"],
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

  async details(req, res, next) {
    try {
      const teacher = await userService.findById(req.params.id);

      if (!teacher) {
        return next(createHttpError(STATUS_CODE.NOT_FOUND));
      }

      const classesJoining = await teacher.getClasses();

      return res.render(RENDER_PATH.ADMIN.DETAILS_TEACHER, {
        req,
        user: req.user,
        title: `Details Teacher`,
        REDIRECT_PATH,
        currPage: "teachers",
        classesJoining,
        teacher,
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
        breadcrumb: {
          items: ["Home", "Teachers", "Details"],
          paths: [
            REDIRECT_PATH.ADMIN.HOME_ADMIN,
            REDIRECT_PATH.ADMIN.HOME_TEACHERS,
          ],
        },
        stringUtil,
        moment,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  async calendars(req, res, next) {
    try {
      const teacher = await userService.findById(req.params.id);
      const classObj = await classService.findById(req.params.classId);
      if (!teacher || !classObj)
        return next(createHttpError(STATUS_CODE.NOT_FOUND));

      let dataCanlendar = {
        className: classObj.name,
        startDate: classObj.startDate,
        endDate: classObj.endDate,
        schedules: [],
        timeLearns: [],
      };

      const classSchedules = await classObj.getClass_Schedules();
      classSchedules.map((scheduleObj) => {
        dataCanlendar.schedules.push(scheduleObj.schedule);
        dataCanlendar.timeLearns.push(scheduleObj.timeLearn);
      });
      dataCanlendar = JSON.stringify(dataCanlendar);

      return res.render(RENDER_PATH.ADMIN.CALENDARS_TEACHER, {
        req,
        user: req.user,
        teacher,
        title: `Calendars Teacher`,
        REDIRECT_PATH,
        dataCanlendar,
        currPage: "teachers",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
        stringUtil,
        moment,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  create: async (req, res) => {
    try {
      const types = await typeService.findAllByTypes(["teacher", "assistant"]);

      return res.render(RENDER_PATH.ADMIN.CREATE_TEACHER, {
        req,
        user: req.user,
        oldValues: req.flash("oldValues")[0] || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Create Teacher`,
        REDIRECT_PATH,
        currPage: "teachers",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
        types,
      });
    } catch (err) {
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleCreateTeacher: async (req, res) => {
    try {
      await userService.create(req.body);
      req.flash("success", MESSAGE_SUCCESS.USER.CREATE_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.CREATE_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.CREATE_TEACHER);
  },

  edit: async (req, res, next) => {
    try {
      const teacherEdit = await userService.findById(req.params.id);
      if (!teacherEdit) throw new Error(MESSAGE_ERROR.USER.USER_NOT_FOUND);
      const types = await typeService.findAllByTypes(["teacher", "assistant"]);
      return res.render(RENDER_PATH.ADMIN.EDIT_TEACHER, {
        req,
        types,
        user: req.user,
        oldValues: req.flash("oldValues")[0] || teacherEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Edit Teacher`,
        REDIRECT_PATH,
        currPage: "teachers",
        success: req.flash("success"),
        error: req.flash("error"),
        stringUtil,
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.NOT_FOUND));
    }
  },

  handleEditTeacher: async (req, res) => {
    const { id } = req.params;
    try {
      await userService.update(req.body, id);
      req.flash("success", MESSAGE_SUCCESS.USER.EDIT_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.EDIT_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.EDIT_TEACHER + `/${id}`);
  },

  handleDeleteTeachers: async (req, res) => {
    try {
      const { id } = req.body;
      await userService.removeUsers(Array.isArray(id) ? id : [id]);
      req.flash("success", MESSAGE_SUCCESS.USER.DELETE_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.DELETE_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.HOME_TEACHERS);
  },

  importTeachersPage: async (req, res) => {
    return res.render(RENDER_PATH.ADMIN.IMPORT_TEACHERS, {
      title: `Import Teachers`,
      user: req.user,
      REDIRECT_PATH,
      breadcrumb: {
        items: ["Home", "Teachers", "Import"],
        paths: [
          REDIRECT_PATH.ADMIN.HOME_ADMIN,
          REDIRECT_PATH.ADMIN.HOME_TEACHERS,
        ],
      },
      currPage: "teachers",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },

  handleImportTeachers: async (req, res) => {
    try {
      await userService.importUsers(
        null,
        req.files[0],
        FIELDS_IMPORT.TEACHER_FIELDS
      );

      req.flash("success", MESSAGE_SUCCESS.FILE.IMPORT_USERS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.IMPORT_USERS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.IMPORT_TEACHERS);
  },

  handleExportTeachers: async (req, res) => {
    try {
      const teachers = await userService.findAllWithTypes([
        "teacher",
        "assistant",
      ]);

      if (!teachers?.length) throw new Error(MESSAGE_INFO.FILE.NOTHING_EXPORT);

      writeFile(
        res,
        SHEET_HEADERS_EXPORT.HEADERS_TEACHER,
        FILE_NAME_EXPORT.TEACHER,
        (sheet) => {
          teachers.forEach(({ name, email, phone, address, Type }) => {
            sheet.addRow({
              name,
              email,
              phone,
              address,
              type: Type.name,
            });
          });
        }
      );
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.EXPORT_USERS_FAILED);
      return res.redirect(REDIRECT_PATH.ADMIN.HOME_TEACHERS);
    }
  },
};
