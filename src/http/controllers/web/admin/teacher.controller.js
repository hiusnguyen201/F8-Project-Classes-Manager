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

const csrf = require("../../../middlewares/web/csrf.middleware");

const stringUtil = require("../../../../utils/string");
const { writeFile } = require("../../../../utils/fileExcel");

const UserService = require("../../../services/user.service");
const userService = new UserService();
const TypeService = require("../../../services/type.service");
const typeService = new TypeService();

module.exports = {
  index: async (req, res) => {
    try {
      const { meta, data: teachers } =
        await userService.findAllWithTypesAndSearchAndPaginate(req.query, [
          "teacher",
          "assistant",
        ]);

      return res.render(RENDER_PATH.HOME_TEACHERS_ADMIN, {
        req,
        user: req.user,
        page: meta.page,
        title: `Manage Teachers - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        totalCount: meta.count,
        offset: meta.offset,
        limit: meta.limit,
        currPage: "teachers",
        teachers,
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
      const types = await typeService.findAllByTypes(["teacher", "assistant"]);

      return res.render(RENDER_PATH.CREATE_TEACHER, {
        req,
        user: req.user,
        oldValues: req.flash("oldValues")[0] || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Create Teacher - ${process.env.APP_NAME}`,
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
      await userService.create(req.body, typeId);
      req.flash("success", MESSAGE_SUCCESS.USER.CREATE_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.CREATE_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.CREATE_TEACHER);
  },

  edit: async (req, res, next) => {
    try {
      const teacherEdit = await userService.findById(req.params.id);
      if (!teacherEdit) throw new Error(MESSAGE_ERROR.USER.USER_NOT_FOUND);
      const types = await typeService.findAllByTypes(["teacher", "assistant"]);
      return res.render(RENDER_PATH.EDIT_TEACHER, {
        req,
        types,
        user: req.user,
        oldValues: req.flash("oldValues")[0] || teacherEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Edit Teacher - ${process.env.APP_NAME}`,
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

    return res.redirect(REDIRECT_PATH.EDIT_TEACHER + `/${id}`);
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

    return res.redirect(REDIRECT_PATH.HOME_TEACHERS_ADMIN);
  },

  importTeachersPage: async (req, res) => {
    return res.render(RENDER_PATH.IMPORT_TEACHERS, {
      title: `Import Teachers - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "teachers",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },

  handleImportTeachers: async (req, res) => {
    try {
      await userService.importUsers(
        null,
        req.file,
        FIELDS_IMPORT.TEACHER_FIELDS
      );

      req.flash("success", MESSAGE_SUCCESS.FILE.IMPORT_USERS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.IMPORT_USERS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.IMPORT_TEACHERS);
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
      return res.redirect(REDIRECT_PATH.HOME_TEACHERS_ADMIN);
    }
  },
};
