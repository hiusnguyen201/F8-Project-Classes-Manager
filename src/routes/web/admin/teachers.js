var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const TEACHER_RULES = RULES_REQUEST.TEACHER_RULES;
const TeacherController = require("../../../http/controllers/web/admin/teacher.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");
const validator = require("../../../utils/validator");

router.get("/", TeacherController.index);

router.get("/create", TeacherController.create);

router.get(
  "/edit/:id",
  validator.make(TEACHER_RULES.GET),
  TeacherController.edit
);

router.post(
  "/create",
  csrf.verify,
  validator.make(TEACHER_RULES.CREATE),
  TeacherController.handleCreateTeacher
);

router.patch(
  "/edit/:id",
  csrf.verify,
  validator.make(TEACHER_RULES.EDIT),
  TeacherController.handleEditTeacher
);

router.delete(
  "/",
  csrf.verify,
  validator.make(TEACHER_RULES.DELETE),
  TeacherController.handleDeleteTeachers
);

router.get("/import", TeacherController.importTeachersPage);

router.post(
  "/import",
  fileMiddleware,
  validator.fileExcel(),
  TeacherController.handleImportTeachers
);

router.get("/export", TeacherController.handleExportTeachers);

module.exports = router;
