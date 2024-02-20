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
      "student",
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

    return res.render(RENDER_PATH.HOME_STUDENTS_ADMIN, {
      req,
      user: req.user,
      page,
      title: `Manage Students - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount: count,
      offset,
      limit,
      currPage: "students",
      students: rows.slice(+offset, +offset + limit) ?? [],
      totalPage,
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
      stringUtil,
    });
  },

  create: async (req, res) => {
    return res.render(RENDER_PATH.CREATE_STUDENT, {
      req,
      user: req.user,
      oldValues: req.flash("oldValues")[0] ?? {},
      errorsValidate: stringUtil.extractErr(req.flash("errors")),
      title: `Create Student - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      currPage: "students",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleCreateStudent: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("oldValues", req.body);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.CREATE_STUDENT);
    }

    const { name, email, phone, address } = req.body;
    const [type, messageType] = await typeService.getType({
      name: "student",
    });

    if (!type) {
      req.flash("error", messageType);
      return res.redirect(REDIRECT_PATH.HOME_STUDENTS_ADMIN);
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

    return res.redirect(REDIRECT_PATH.CREATE_STUDENT);
  },

  edit: async (req, res, next) => {
    const { id } = req.params;

    const { errors } = validationResult(req);
    if (errors?.length) {
      return next(createHttpError(404));
    }

    const [studentEdit] = await userService.getUser({
      id,
    });

    const oldValues = req.flash("oldValues")[0] ?? studentEdit ?? {};

    return res.render(RENDER_PATH.EDIT_STUDENT, {
      req,
      user,
      oldValues,
      errorsValidate: stringUtil.extractErr(req.flash("errors")),
      title: `Edit Student - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      currPage: "students",
      success: req.flash("success"),
      error: req.flash("error"),
      stringUtil,
      csrf,
    });
  },

  handleEditStudent: async (req, res) => {
    const { id } = req.body;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("errors", errors);
      req.flash("oldValues", req.body);
      return res.redirect(REDIRECT_PATH.EDIT_STUDENT + `/${id}`);
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

    return res.redirect(REDIRECT_PATH.EDIT_STUDENT + `/${id}`);
  },

  handleDeleteStudents: async (req, res) => {
    const { id } = req.body;

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.HOME_STUDENTS_ADMIN);
    }

    const [status, message] = await userService.removeUsers(
      Array.isArray(id) ? id : [id]
    );
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.HOME_STUDENTS_ADMIN);
  },

  importStudentsPage: async (req, res) => {
    return res.render(RENDER_PATH.IMPORT_STUDENTS, {
      title: `Import Students - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "students",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },

  handleImportStudents: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.IMPORT_STUDENTS);
    }

    const [status, message] = await userService.importUsers(
      "student",
      req.file,
      FIELDS_IMPORT.STUDENT_FIELDS
    );
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.IMPORT_STUDENTS);
  },

  handleExportStudents: async (req, res) => {
    const [users, message] = await userService.getAllUser(["student"]);

    if (!users) {
      req.flash("error", message);
      return res.redirect(REDIRECT_PATH.HOME_STUDENTS_ADMIN);
    }

    fileExcel.writeFile(
      res,
      SHEET_HEADERS_EXPORT.HEADERS_STUDENT,
      FILE_NAME_EXPORT.STUDENT,
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
