var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const COURSE_RULES = RULES_REQUEST.COURSE_RULES;
const CourseController = require("../../../http/controllers/web/admin/course.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");
const validator = require("../../../utils/validator");

router.get("/", CourseController.index);

router.get("/create", CourseController.create);

router.get(
  "/edit/:id",
  validator.make(COURSE_RULES.GET),
  CourseController.edit
);

router.post(
  "/create",
  csrf.verify,
  validator.make(COURSE_RULES.CREATE),
  CourseController.handleCreateCourse
);

router.patch(
  "/edit/:id",
  csrf.verify,
  validator.make(COURSE_RULES.EDIT),
  CourseController.handleEditCourse
);

router.delete(
  "/",
  csrf.verify,
  validator.make(COURSE_RULES.DELETE),
  CourseController.handleDeleteCourses
);

router.get("/import", CourseController.importCoursesPage);

router.post(
  "/import",
  fileMiddleware,
  validator.fileExcel(),
  CourseController.handleImportCourses
);

router.get("/export", CourseController.handleExportCourses);

module.exports = router;
