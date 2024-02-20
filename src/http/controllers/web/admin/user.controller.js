const createHttpError = require("http-errors");
const { validationResult } = require("express-validator");
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
const userService = require("../../../services/user.service");
const typeService = require("../../../services/type.service");

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
        {
          email: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          phone: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          address: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    const [{ count, rows }] = await userService.countAllUserByType(filters, [
      "admin",
    ]);

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

    return res.render(RENDER_PATH.HOME_USERS_ADMIN, {
      req,
      user: req.user,
      page,
      title: `Manage Users - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount: count,
      offset,
      limit,
      currPage: "users",
      users: rows.slice(+offset, +offset + limit) ?? [],
      totalPage,
      success,
      error,
      csrf,
      stringUtil,
    });
  },

  create: async (req, res) => {
    return res.render(RENDER_PATH.CREATE_USER, {
      req,
      user: req.user,
      oldValues: req.flash("oldValues")[0] ?? {},
      errorsValidate: stringUtil.extractErr(req.flash("errors")),
      title: `Create User - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      currPage: "users",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleCreateUser: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("oldValues", req.body);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.CREATE_USER);
    }

    const { name, email, phone, address } = req.body;
    const [type, messageType] = await typeService.getType({
      name: "admin",
    });

    if (!type) {
      req.flash("error", messageType);
      return res.redirect(REDIRECT_PATH.HOME_USERS_ADMIN);
    }

    const [status, messageUser] = await userService.createUser(
      name,
      email,
      phone,
      address,
      +type.id
    );

    if (!status) {
      req.flash("error", messageUser);
    } else {
      req.flash("success", messageUser);
    }

    return res.redirect(REDIRECT_PATH.CREATE_USER);
  },

  edit: async (req, res, next) => {
    const { id } = req.params;

    const { errors } = validationResult(req);
    if (errors?.length) {
      return next(createHttpError(404));
    }

    const [userEdit] = await userService.getUser({
      id,
    });

    return res.render(RENDER_PATH.EDIT_USER, {
      req,
      user: req.user,
      oldValues: req.flash("oldValues")[0] ?? userEdit ?? {},
      errorsValidate: stringUtil.extractErr(req.flash("errors")),
      title: `Edit User - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      currPage: "users",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleEditUser: async (req, res) => {
    const { id } = req.params;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("errors", errors);
      req.flash("oldValues", req.body);
      return res.redirect(REDIRECT_PATH.EDIT_USER + `/${id}`);
    }

    const { name, email, phone, address } = req.body;
    const [status, message] = await userService.editUser(
      +id,
      name,
      email,
      phone,
      address
    );

    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }

    return res.redirect(REDIRECT_PATH.EDIT_USER + `/${id}`);
  },

  handleDeleteUsers: async (req, res) => {
    const { id } = req.body;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.HOME_USERS_ADMIN);
    }

    const [status, message] = await userService.removeUsers(
      Array.isArray(id) ? id : [id]
    );
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.HOME_USERS_ADMIN);
  },

  importUsersPage: async (req, res) => {
    return res.render(RENDER_PATH.IMPORT_USERS, {
      title: `Import Users - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "users",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },

  handleImportUsers: async (req, res) => {
    const { errors } = validationResult(req);

    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.IMPORT_USERS);
    }

    const [status, message] = await userService.importUsers(
      "admin",
      req.file,
      FIELDS_IMPORT.USER_FIELDS
    );

    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.IMPORT_USERS);
  },

  handleExportUsers: async (req, res) => {
    const [users, message] = await userService.getAllUser(["admin"]);

    if (!users) {
      req.flash("error", message);
      return res.redirect(REDIRECT_PATH.HOME_USERS_ADMIN);
    }

    fileExcel.writeFile(
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
  },
};
