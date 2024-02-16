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

    const [totalCount] = await userService.countAllUserByType(
      filters,
      "student"
    );

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
    const [students] = await userService.getAllUser(
      ["student"],
      filters,
      +offset,
      +limit
    );

    const oldValues = req.flash("oldValues");
    const errorsValidate = req.flash("errors");
    const modalCreate = req.flash("modalCreate")[0];
    const modalUpdate = req.flash("modalUpdate")[0];

    return res.render(RENDER_PATH.HOME_ADMIN_STUDENTS, {
      req,
      user: req.user,
      modalCreate,
      modalUpdate,
      students: students ?? [],
      page,
      oldValues: oldValues[0] ?? {},
      errorsValidate,
      title: `Manage Students - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      totalCount,
      currPage: "students",
      offset,
      limit,
      totalPage,
      success,
      error,
      stringUtil,
      csrf,
    });
  },

  importStudentsPage: async (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    return res.render(RENDER_PATH.ADMIN_IMPORT_STUDENTS, {
      title: `Import Students - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "students",
      error,
      success,
    });
  },

  // Handle
  handleCreateStudent: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("modalCreate", true);
      req.flash("oldValues", req.body);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.STUDENTS_ADMIN);
    }

    const { name, email, phone, address } = req.body;
    const [type, messageType] = await typeService.getType({
      name: "student",
    });

    if (!type) {
      req.flash("error", messageType);
      return res.redirect(REDIRECT_PATH.STUDENTS_ADMIN);
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

    return res.redirect(REDIRECT_PATH.STUDENTS_ADMIN);
  },

  handleUpdateStudent: async (req, res) => {
    const { userId } = req.body;
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("modalUpdate", userId);
      req.flash("errors", errors);
      return res.redirect(REDIRECT_PATH.STUDENTS_ADMIN);
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

    return res.redirect(REDIRECT_PATH.STUDENTS_ADMIN);
  },

  handleDeleteStudents: async (req, res) => {
    const { userId } = req.body;
    let arrId = userId.split(",");
    arrId = arrId.map((id) => parseInt(id));

    const [status, message] = await userService.removeUsers(arrId);
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.STUDENTS_ADMIN);
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
      return res.redirect(REDIRECT_PATH.STUDENTS_ADMIN);
    }

    fileExcel.handleExportFile(
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
