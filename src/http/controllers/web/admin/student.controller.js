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

const UserService = require("../../../services/user.service");
const userService = new UserService();
const TypeService = require("../../../services/type.service");
const typeService = new TypeService();

module.exports = {
  index: async (req, res) => {
    try {
      const { meta, data: students } =
        await userService.findAllWithTypesAndSearchAndPaginate(
          req.query,
          "student"
        );

      return res.render(RENDER_PATH.ADMIN.HOME_STUDENTS, {
        req,
        user: req.user,
        page: meta.page,
        title: `Manage Students`,
        REDIRECT_PATH,
        totalCount: meta.count,
        offset: meta.offset,
        limit: meta.limit,
        currPage: "students",
        students,
        breadcrumb: {
          items: ["Dashboard", "Students"],
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
      const student = await userService.findById(req.params.id);
      if (!student) {
        return next(createHttpError(STATUS_CODE.NOT_FOUND));
      }

      return res.render(RENDER_PATH.ADMIN.DETAILS_STUDENT, {
        req,
        user: req.user,
        title: `Details Student`,
        REDIRECT_PATH,
        currPage: "students",
        student,
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
    return res.render(RENDER_PATH.ADMIN.CREATE_STUDENT, {
      req,
      user: req.user,
      oldValues: req.flash("oldValues")[0] || {},
      errorsValidate: req.flash("errors")[0] || {},
      title: `Create Student`,
      REDIRECT_PATH,
      currPage: "students",
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleCreateStudent: async (req, res) => {
    try {
      const type = await typeService.findByName("student");
      if (!type) {
        throw new Error(MESSAGE_ERROR.TYPE.TYPE_NOT_FOUND);
      }
      await userService.create(req.body, +type.id);

      req.flash("success", MESSAGE_SUCCESS.USER.CREATE_USER_SUCCESS);
    } catch (error) {
      req.flash("error", error);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.CREATE_STUDENT);
  },

  edit: async (req, res, next) => {
    try {
      const studentEdit = await userService.findById(req.params.id);
      if (!studentEdit) throw new Error(MESSAGE_ERROR.USER.USER_NOT_FOUND);
      return res.render(RENDER_PATH.ADMIN.EDIT_STUDENT, {
        req,
        user: req.user,
        oldValues: req.flash("oldValues")[0] || studentEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Edit Student`,
        REDIRECT_PATH,
        currPage: "students",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.NOT_FOUND));
    }
  },

  handleEditStudent: async (req, res) => {
    const { id } = req.params;
    try {
      await userService.update(req.body, id);
      req.flash("success", MESSAGE_SUCCESS.USER.EDIT_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.EDIT_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.EDIT_STUDENT + `/${id}`);
  },

  handleDeleteStudents: async (req, res) => {
    try {
      const { id } = req.body;
      await userService.removeUsers(Array.isArray(id) ? id : [id]);
      req.flash("success", MESSAGE_SUCCESS.USER.DELETE_USER_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.DELETE_USER_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.HOME_STUDENTS);
  },

  importStudentsPage: async (req, res) => {
    return res.render(RENDER_PATH.ADMIN.IMPORT_STUDENTS, {
      title: `Import Students`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "students",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },

  handleImportStudents: async (req, res) => {
    try {
      await userService.importUsers(
        "student",
        req.files[0],
        FIELDS_IMPORT.STUDENT_FIELDS
      );

      req.flash("success", MESSAGE_SUCCESS.FILE.IMPORT_USERS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.IMPORT_USERS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.IMPORT_STUDENTS);
  },

  handleExportStudents: async (req, res) => {
    try {
      const students = await userService.findAllWithTypes("student");

      if (!students?.length) throw new Error(MESSAGE_INFO.FILE.NOTHING_EXPORT);

      writeFile(
        res,
        SHEET_HEADERS_EXPORT.HEADERS_STUDENT,
        FILE_NAME_EXPORT.STUDENT,
        (sheet) => {
          students.forEach(({ name, email, phone, address }) => {
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
      return res.redirect(REDIRECT_PATH.ADMIN.HOME_STUDENTS);
    }
  },
};
