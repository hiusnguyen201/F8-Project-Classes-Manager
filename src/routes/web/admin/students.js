var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const USER_RULES = RULES_REQUEST.USER_RULES;
const StudentController = require("../../../http/controllers/web/admin/student.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");
const validator = require("../../../utils/validator");

router.get("/", StudentController.index);

router.get("/create", StudentController.create);

router.post(
  "/create",
  csrf.verify,
  validator.make(USER_RULES.CREATE),
  StudentController.handleCreateStudent
);

router.get("/edit/:id", StudentController.edit);

router.patch(
  "/edit/:id",
  csrf.verify,
  validator.make(USER_RULES.EDIT),
  StudentController.handleEditStudent
);

router.delete("/", csrf.verify, StudentController.handleDeleteStudents);

router.get("/import", StudentController.importStudentsPage);

router.post(
  "/import",
  fileMiddleware,
  validator.fileExcel(),
  StudentController.handleImportStudents
);

router.get("/export", StudentController.handleExportStudents);

module.exports = router;
