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

module.exports = {
  async index(req, res, next) {
    try {
      const { meta, data: users } =
        await userService.findAllWithTypesAndSearchAndPaginate(
          req.query,
          "admin"
        );

      return res.render(RENDER_PATH.ADMIN.HOME_USERS, {
        req,
        user: req.user,
        page: meta.page,
        title: `Manage Users`,
        breadcrumb: {
          items: ["Home", "Users"],
          paths: [REDIRECT_PATH.ADMIN.HOME_ADMIN],
        },
        REDIRECT_PATH,
        totalCount: meta.count,
        offset: meta.offset,
        limit: meta.limit,
        currPage: "users",
        users,
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
      const admin = await userService.findById(req.params.id);
      if (!admin) {
        return next(createHttpError(STATUS_CODE.NOT_FOUND));
      }

      return res.render(RENDER_PATH.ADMIN.DETAILS_USER, {
        req,
        user: req.user,
        title: `Details User`,
        REDIRECT_PATH,
        breadcrumb: {
          items: ["Home", "Users", "Details"],
          paths: [
            REDIRECT_PATH.ADMIN.HOME_ADMIN,
            REDIRECT_PATH.ADMIN.HOME_USERS,
          ],
        },
        currPage: "users",
        admin,
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

  create(req, res) {
    return res.render(RENDER_PATH.ADMIN.CREATE_USER, {
      req,
      user: req.user,
      oldValues: req.flash("oldValues")[0] || {},
      errorsValidate: req.flash("errors")[0] || {},
      title: `Create User`,
      REDIRECT_PATH,
      currPage: "users",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  async handleCreateUser(req, res) {
    try {
      const type = await typeService.findByName("admin");
      if (!type) {
        throw new Error(MESSAGE_ERROR.TYPE.TYPE_NOT_FOUND);
      }
      await userService.create(req.body, +type.id);

      req.flash("success", MESSAGE_SUCCESS.USER.CREATE_USER_SUCCESS);
    } catch (error) {
      req.flash("error", MESSAGE_ERROR.USER.CREATE_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.CREATE_USER);
  },

  async edit(req, res, next) {
    try {
      const userEdit = await userService.findById(req.params.id);
      if (!userEdit) throw new Error(MESSAGE_ERROR.USER.USER_NOT_FOUND);
      return res.render(RENDER_PATH.ADMIN.EDIT_USER, {
        req,
        user: req.user,
        oldValues: req.flash("oldValues")[0] || userEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Edit User`,
        REDIRECT_PATH,
        currPage: "users",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.NOT_FOUND));
    }
  },

  async handleEditUser(req, res) {
    const { id } = req.params;
    try {
      await userService.update(req.body, id);
      req.flash("success", MESSAGE_SUCCESS.USER.EDIT_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.EDIT_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.EDIT_USER + `/${id}`);
  },

  async handleDeleteUsers(req, res) {
    try {
      const { id } = req.body;
      await userService.removeUsers(Array.isArray(id) ? id : [id]);
      req.flash("success", MESSAGE_SUCCESS.USER.DELETE_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.DELETE_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.HOME_USERS);
  },

  importUsersPage(req, res) {
    return res.render(RENDER_PATH.ADMIN.IMPORT_USERS, {
      title: `Import Users`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "users",
      error: req.flash("error"),
      success: req.flash("success"),
      breadcrumb: {
        items: ["Home", "Users", "Import"],
        paths: [REDIRECT_PATH.ADMIN.HOME_ADMIN, REDIRECT_PATH.ADMIN.HOME_USERS],
      },
    });
  },

  async handleImportUsers(req, res) {
    try {
      await userService.importUsers(
        "admin",
        req.files[0],
        FIELDS_IMPORT.USER_FIELDS
      );

      req.flash("success", MESSAGE_SUCCESS.FILE.IMPORT_USERS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.IMPORT_USERS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.IMPORT_USERS);
  },

  async handleExportUsers(req, res) {
    try {
      const users = await userService.findAllWithTypes("admin");

      if (!users?.length) throw new Error(MESSAGE_INFO.FILE.NOTHING_EXPORT);

      writeFile(
        res,
        SHEET_HEADERS_EXPORT.HEADERS_USER,
        FILE_NAME_EXPORT.USER,
        (sheet) => {
          users.forEach(({ name, email, phone, address }) => {
            sheet.addRow({
              name,
              email,
              phone,
              address,
            });
          });
        }
      );
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.EXPORT_USERS_FAILED);
      return res.redirect(REDIRECT_PATH.ADMIN.HOME_USERS);
    }
  },
};
