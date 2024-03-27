var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const CLASS_RULES = RULES_REQUEST.CLASS_RULES;
const ClassController = require("../../../http/controllers/web/admin/class.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");
const validator = require("../../../utils/validator");

router.get("/", ClassController.index);

router.get("/create", ClassController.create);
router.get("/details/:id", ClassController.details);

router.post(
  "/create",
  csrf.verify,
  validator.make(CLASS_RULES.CREATE),
  ClassController.handleCreateClass
);

router.get("/edit/:id", ClassController.edit);

router.patch(
  "/edit/:id",
  csrf.verify,
  validator.make(CLASS_RULES.EDIT),
  ClassController.handleEditClass
);

router.delete("/", csrf.verify, ClassController.handleDeleteClasses);

router.get("/import", ClassController.importClassesPage);
router.post(
  "/import",
  fileMiddleware,
  validator.file("excel"),
  ClassController.handleImportClasses
);
router.get("/export", ClassController.handleExportClasses);

// Manage Students
router.get("/details/:id/students", ClassController.manageStudentsPage);
router.get("/details/:id/students/add", ClassController.addStudentPage);
router.post(
  "/details/:id/students/add",
  csrf.verify,
  validator.make(CLASS_RULES.ADD_STUDENT),
  ClassController.handleAddStudents
);
router.get(
  "/details/:id/students/edit/:studentClass",
  ClassController.editStudentPage
);
router.patch(
  "/details/:id/students/edit/:studentClass",
  csrf.verify,
  validator.make(CLASS_RULES.EDIT_STUDENT),
  ClassController.handleEditStudent
);
router.delete(
  "/details/:id/students",
  csrf.verify,
  ClassController.handleDeleteStudentsClass
);

// Manage Calendars
router.get("/details/:id/calendars", ClassController.manageCalendarsPage);
router.get(
  "/details/:id/calendars/:calendarId",
  ClassController.attendancePage
);
router.patch(
  "/details/:id/calendars/:calendarId",
  csrf.verify,
  ClassController.handleAttendanceCalendar
);

// Manage Exercises
router.get("/details/:id/exercises", ClassController.manageExercisesPage);
router.get("/details/:id/exercises/create", ClassController.createExercisePage);
router.post(
  "/details/:id/exercises/create",
  csrf.verify,
  validator.make(CLASS_RULES.CREATE_EXERCISE),
  ClassController.handleCreateExercise
);
router.get(
  "/details/:id/exercises/edit/:exerciseId",
  ClassController.editExercisePage
);
router.patch(
  "/details/:id/exercises/edit/:exerciseId",
  csrf.verify,
  validator.make(CLASS_RULES.EDIT_EXERCISE),
  ClassController.handleEditExercise
);
router.delete(
  "/details/:id/exercises",
  csrf.verify,
  ClassController.handleDeleteExercises
);

module.exports = router;
