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
  // Page
  index: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");
    const user = req.user;
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

    const [totalCount] = await userService.countAllUserByType(filters, [
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

    const totalPage = Math.ceil(totalCount / limit);
    if (page < 1 || !page) {
      page = 1;
    } else if (page > totalPage) {
      page = totalPage;
    }

    const offset = (page - 1) * limit;
    const [teachers] = await userService.getAllUser(
      ["teacher", "assistant"],
      filters,
      offset,
      limit
    );

    const oldValues = req.flash("oldValues");
    const errorsValidate = req.flash("errors");
    const modalCreate = req.flash("modalCreate")[0];
    const modalUpdate = req.flash("modalUpdate")[0];

    return res.render(RENDER_PATH.HOME_ADMIN_TEACHERS, {
      req,
      user: req.user,
      modalCreate,
      modalUpdate,
      teachers: teachers ?? [],
      page,
      oldValues: oldValues[0] ?? {},
      errorsValidate,
      title: `Manage Teachers - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount,
      currPage: "teachers",
      offset,
      limit,
      totalPage,
      success,
      error,
      stringUtil,
      csrf,
    });
  },

  importTeachersPage: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    return res.render(RENDER_PATH.ADMIN_IMPORT_TEACHERS, {
      title: `Import Teachers - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "teachers",
      error,
      success,
    });
  },

  // Handle
  handleCreateTeacher: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("oldValues", req.body);
      req.flash("modalCreate", true);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.TEACHERS_ADMIN);
    }

    const { name, email, phone, address, type } = req.body;
    const [typeObj, messageType] = await typeService.getType({
      name: type,
    });

    if (!typeObj) {
      req.flash("error", messageType);
      return res.redirect(REDIRECT_PATH.TEACHERS_ADMIN);
    }

    const [status, messageUser] = await userService.createUser(
      name,
      email,
      phone,
      address,
      type.id
    );

    if (!status) {
      req.flash("error", messageUser);
    } else {
      req.flash("success", messageUser);
    }

    return res.redirect(REDIRECT_PATH.TEACHERS_ADMIN);
  },

  handleUpdateTeacher: async (req, res) => {
    const { userId } = req.body;
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("errors", errors);
      req.flash("modalUpdate", userId);
      return res.redirect(REDIRECT_PATH.TEACHERS_ADMIN);
    }

    const { name, email, phone, address } = req.body;
    const [status, message] = await userService.updateUser(
      +userId,
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

    return res.redirect(REDIRECT_PATH.TEACHERS_ADMIN);
  },

  handleDeleteTeachers: async (req, res) => {
    const { userId } = req.body;
    let arrId = userId.split(",");
    arrId = arrId.map((id) => parseInt(id));

    const [status, message] = await userService.removeUsers(arrId);
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.TEACHERS_ADMIN);
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
      return res.redirect(REDIRECT_PATH.TEACHERS_ADMIN);
    }

    fileExcel.handleExportFile(
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
