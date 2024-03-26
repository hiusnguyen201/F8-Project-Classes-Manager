var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const COURSE_RULES = RULES_REQUEST.COURSE_RULES;
const MODULE_RULES = RULES_REQUEST.MODULE_RULES;
const CourseController = require("../../../http/controllers/web/admin/course.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");
const validator = require("../../../utils/validator");

router.get("/", CourseController.index);

router.get("/create", CourseController.create);

router.get("/details/:id", CourseController.details);

router.get("/details/:id/modules/create", CourseController.createModule);
router.post(
  "/details/:id/modules/create",
  fileMiddleware,
  validator.file(["word", "pdf"]),
  validator.make(MODULE_RULES.CREATE),
  CourseController.handleCreateModule
);

router.get("/details/:id/modules/edit/:moduleId", CourseController.editModule);
router.post(
  "/details/:id/modules/edit/:moduleId",
  fileMiddleware,
  validator.file(["word", "pdf"]),
  validator.make(MODULE_RULES.EDIT),
  CourseController.handleEditModule
);
router.delete(
  "/details/:id/modules/delete/:moduleId",
  CourseController.handleDeleteModules
);

router.post(
  "/create",
  csrf.verify,
  validator.make(COURSE_RULES.CREATE),
  CourseController.handleCreateCourse
);

router.get("/edit/:id", CourseController.edit);

router.patch(
  "/edit/:id",
  csrf.verify,
  validator.make(COURSE_RULES.EDIT),
  CourseController.handleEditCourse
);

router.delete("/", csrf.verify, CourseController.handleDeleteCourses);

router.get("/import", CourseController.importCoursesPage);

router.post(
  "/import",
  fileMiddleware,
  validator.file("excel"),
  CourseController.handleImportCourses
);

router.get("/export", CourseController.handleExportCourses);

module.exports = router;
