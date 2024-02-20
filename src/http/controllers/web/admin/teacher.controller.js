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
      "teacher",
      "assistant",
    ]);

    if (!limit) {
      limit = 10;
    } else {
      if (+limit === 25 || limit === 50 || limit === 100) {
        limit = limit;
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

    const offset = (page - 1) * limit;

    return res.render(RENDER_PATH.HOME_TEACHERS_ADMIN, {
      req,
      user: req.user,
      teachers: rows.slice(+offset, +offset + limit) ?? [],
      page,
      title: `Manage Teachers - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount: count,
      currPage: "teachers",
      offset,
      limit,
      totalPage,
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
      stringUtil,
    });
  },

  create: async (req, res) => {
    const [types] = await typeService.getAllType(["teacher", "assistant"]);
    return res.render(RENDER_PATH.CREATE_TEACHER, {
      req,
      types,
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

  handleCreateTeacher: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("oldValues", req.body);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.CREATE_TEACHER);
    }

    const { name, email, phone, address, typeId } = req.body;

    const [status, messageUser] = await userService.createUser(
      name,
      email,
      phone,
      address,
      typeId
    );

    if (!status) {
      req.flash("error", messageUser);
    } else {
      req.flash("success", messageUser);
    }

    return res.redirect(REDIRECT_PATH.CREATE_TEACHER);
  },

  edit: async (req, res, next) => {
    const { id } = req.params;
    const [types] = await typeService.getAllType(["teacher", "assistant"]);

    const { errors } = validationResult(req);
    if (errors?.length) {
      return next(createHttpError(404));
    }

    const [teacherEdit] = await userService.getUser({
      id,
    });

    return res.render(RENDER_PATH.EDIT_TEACHER, {
      req,
      types,
      user: req.user,
      oldValues: req.flash("oldValues")[0] ?? teacherEdit ?? {},
      errorsValidate: stringUtil.extractErr(req.flash("errors")),
      title: `Edit User - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      currPage: "users",
      success: req.flash("success"),
      error: req.flash("error"),
      stringUtil,
      csrf,
    });
  },

  handleEditTeacher: async (req, res) => {
    const { id } = req.params;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.EDIT_TEACHER + `/${id}`);
    }

    const { name, email, phone, address, typeId } = req.body;
    const [status, message] = await userService.editUser(
      +id,
      name,
      email,
      phone,
      address,
      typeId
    );

    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }

    return res.redirect(REDIRECT_PATH.EDIT_TEACHER + `/${id}`);
  },

  handleDeleteTeachers: async (req, res) => {
    const { id } = req.body;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.HOME_TEACHERS_ADMIN);
    }

    const [status, message] = await userService.removeUsers(
      Array.isArray(id) ? id : [id]
    );
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
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
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.IMPORT_TEACHERS);
    }

    const [status, message] = await userService.importUsers(
      null,
      req.file,
      FIELDS_IMPORT.TEACHER_FIELDS
    );

    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.IMPORT_TEACHERS);
  },

  handleExportTeachers: async (req, res) => {
    const [users, message] = await userService.getAllUser([
      "teacher",
      "assistant",
    ]);

    if (!users) {
      req.flash("error", message);
      return res.redirect(REDIRECT_PATH.HOME_TEACHERS_ADMIN);
    }

    fileExcel.writeFile(
      res,
      SHEET_HEADERS_EXPORT.HEADERS_TEACHER,
      FILE_NAME_EXPORT.TEACHER,
      (sheet) => {
        users.forEach(({ name, email, phone, address, Type }) => {
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
  },
};
