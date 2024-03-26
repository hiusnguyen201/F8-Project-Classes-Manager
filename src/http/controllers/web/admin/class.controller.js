const createHttpError = require("http-errors");
const moment = require("moment");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
  MESSAGE_INFO,
} = require("../../../../constants/message.constant");
const { STATUS_CODE } = require("../../../../constants/status.constant");
const { ATTENDANCE_STATUS } = require("../../../../constants/setting.constant");
const {
  FILE_NAME_EXPORT,
  SHEET_HEADERS_EXPORT,
  FIELDS_IMPORT,
} = require("../../../../constants/fileExcel.constant");

const stringUtil = require("../../../../utils/string");
const { writeFile } = require("../../../../utils/fileExcel");

const csrf = require("../../../middlewares/web/csrf.middleware");

const CourseService = require("../../../services/course.service");
const courseService = new CourseService();

const UserService = require("../../../services/user.service");
const userService = new UserService();

const ClassService = require("../../../services/class.service");
const classService = new ClassService();

const LearningStatus = require("../../../services/learningStatus.service");
const learningStatusService = new LearningStatus();

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
        csrf,
        moment,
        stringUtil,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  create: async (req, res) => {
    try {
      const courses = await courseService.findAll();
      const assistants = await userService.findAllWithTypes("assistant");

      return res.render(RENDER_PATH.ADMIN.CREATE_CLASS, {
        req,
        user: req.user,
        courses,
        assistants,
        oldValues: req.flash("oldValues")[0] || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Create Class - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        currPage: "classes",
        success: req.flash("success"),
        error: req.flash("error"),
        moment,
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  details: async (req, res, next) => {
    try {
      const classObj = await classService.findById(req.params.id);
      if (!classObj) {
        return next(createHttpError(STATUS_CODE.NOT_FOUND));
      }

      return res.render(RENDER_PATH.ADMIN.DETAILS_CLASS, {
        req,
        user: req.user,
        title: `Details Class - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        currPage: "classes",
        classObj,
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

  handleCreateClass: async (req, res) => {
    try {
      await classService.create(req.body);
      req.flash("success", MESSAGE_SUCCESS.CLASS.CREATE_CLASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.CLASS.CREATE_CLASS_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  edit: async (req, res, next) => {
    try {
      const classEdit = await classService.findById(req.params.id);
      if (!classEdit) throw new Error(MESSAGE_ERROR.CLASS.CLASS_NOT_FOUND);

      const courses = await courseService.findAll();
      const assistants = await userService.findAllWithTypes("assistant");

      return res.render(RENDER_PATH.ADMIN.EDIT_CLASS, {
        req,
        user: req.user,
        courses,
        assistants,
        oldValues: req.flash("oldValues")[0] || classEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        title: `Edit Class - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        currPage: "classes",
        success: req.flash("success"),
        error: req.flash("error"),
        moment,
        csrf,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.NOT_FOUND));
    }
  },

  handleEditClass: async (req, res) => {
    const { id, studentAttendance } = req.params;
    try {
      await classService.update(req.body, id, studentAttendance);
      req.flash("success", MESSAGE_SUCCESS.CLASS.EDIT_CLASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.CLASS.EDIT_CLASS_FAILED);
    }

    return res.redirect(req.originalUrl);
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

    return res.redirect(req.originalUrl);
  },

  importClassesPage: async (req, res) => {
    return res.render(RENDER_PATH.ADMIN.IMPORT_CLASSES, {
      title: `Import Classes - ${process.env.APP_NAME}`,
      user: req.user,
      REDIRECT_PATH,
      currPage: "classes",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  },

  handleImportClasses: async (req, res) => {
    try {
      await classService.importClasses(
        req.files[0],
        FIELDS_IMPORT.CLASS_FIELDS
      );
      req.flash("success", MESSAGE_SUCCESS.FILE.IMPORT_CLASSES_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.IMPORT_CLASSES_FAILED);
    }

    return res.redirect(req.originalUrl);
  },

  handleExportClasses: async (req, res) => {
    try {
      const classes = await classService.findAll();

      if (!classes?.length) throw new Error(MESSAGE_INFO.FILE.NOTHING_EXPORT);

      writeFile(
        res,
        SHEET_HEADERS_EXPORT.HEADERS_CLASS,
        FILE_NAME_EXPORT.CLASS_FIELDS,
        (sheet) => {
          classes.forEach(
            ({
              name,
              quantity,
              startDate,
              endDate,
              Course,
              Class_Schedules,
            }) => {
              let schedules = "",
                timeLearns = "";

              Class_Schedules.map((scheduleObj, index) => {
                schedules += moment.weekdays(scheduleObj.schedule);
                timeLearns += scheduleObj.timeLearn;
                if (index != Class_Schedules.length - 1) {
                  schedules += ",";
                  timeLearns += ",";
                }
              });

              sheet.addRow({
                name,
                quantity,
                startDate,
                endDate,
                course: Course.name,
                schedules,
                timeLearns,
              });
            }
          );
        }
      );
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.FILE.EXPORT_CLASSES_FAILED);
      return res.redirect(req.originalUrl);
    }
  },

  addStudentPage: async (req, res) => {
    try {
      const classObj = await classService.findById(req.params.id);
      if (!classObj) {
        return next(createHttpError(STATUS_CODE.NOT_FOUND));
      }

      const students = await userService.findAllWithTypes("student");
      const learningStatuses = await learningStatusService.findAll();

      return res.render(RENDER_PATH.ADMIN.ADD_STUDENT_CLASS, {
        req,
        user: req.user,
        title: `Add Student - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        students,
        learningStatuses,
        currPage: "classes",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
        oldValues: req.flash("oldValues")[0] || {},
        errorsValidate: req.flash("errors")[0] || {},
        stringUtil,
        moment,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleAddStudents: async (req, res) => {
    try {
      await classService.addStudent(req.body, req.params.id);
      req.flash("success", MESSAGE_SUCCESS.CLASS.ADD_STUDENT_TO_CLASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
    }

    return res.redirect(req.originalUrl);
  },

  editStudentPage: async (req, res, next) => {
    try {
      const { id, studentClass } = req.params;

      const classObj = await classService.findById(id);
      if (!classObj) return next(createHttpError(STATUS_CODE.NOT_FOUND));

      const studentClassEdit = await classService.findStudentInClass(
        studentClass
      );
      if (!studentClassEdit)
        return next(createHttpError(STATUS_CODE.NOT_FOUND));

      const students = await userService.findAllWithTypes("student");
      const learningStatuses = await learningStatusService.findAll();

      return res.render(RENDER_PATH.ADMIN.EDIT_STUDENT_CLASS, {
        req,
        user: req.user,
        title: `Edit Student - ${process.env.APP_NAME}`,
        REDIRECT_PATH,
        students,
        learningStatuses,
        currPage: "classes",
        success: req.flash("success"),
        error: req.flash("error"),
        csrf,
        oldValues: req.flash("oldValues")[0] || studentClassEdit || {},
        errorsValidate: req.flash("errors")[0] || {},
        stringUtil,
        moment,
      });
    } catch (err) {
      console.log(err);
      return next(createHttpError(STATUS_CODE.SERVER_ERROR));
    }
  },

  handleEditStudent: async (req, res) => {
    try {
      await classService.editStudent(
        req.body,
        req.params.id,
        req.params.studentClass
      );
      req.flash("success", MESSAGE_SUCCESS.CLASS.EDIT_STUDENT_TO_CLASS_SUCCESS);
    } catch (err) {
      req.flash("error", err.message);
    }

    return res.redirect(req.originalUrl);
  },

  handleDeleteStudentsClass: async (req, res) => {
    const { id } = req.body;
    const { id: classId } = req.params;
    try {
      await classService.removeStudentsClass(Array.isArray(id) ? id : [id]);
      req.flash("success", MESSAGE_SUCCESS.CLASS.DELETE_STUDENT_CLASS_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.CLASS.DELETE_STUDENT_CLASS_FAILED);
    }

    return res.redirect(REDIRECT_PATH.ADMIN.DETAILS_CLASS + `/${classId}`);
  },

  attendancePage: async (req, res) => {
    const { calendarId } = req.params;

    const calendar = await classService.findCalendarById(calendarId);

    return res.render(RENDER_PATH.ADMIN.CALENDAR_ATTENDANCES, {
      req,
      user: req.user,
      title: `Attendance - ${process.env.APP_NAME}`,
      REDIRECT_PATH,
      ATTENDANCE_STATUS,
      currPage: "classes",
      calendar,
      success: req.flash("success"),
      error: req.flash("error"),
      csrf,
    });
  },

  handleAttendanceCalendar: async (req, res) => {
    try {
      await classService.updateAttendance(req.body, req.params.calendarId);
      req.flash(
        "success",
        MESSAGE_SUCCESS.CLASS.EDIT_ATTENDANCE_CALENDAR_SUCCESS
      );
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.CLASS.EDIT_ATTENDANCE_CALENDAR_FAILED);
    }

    return res.redirect(req.originalUrl);
  },
};
