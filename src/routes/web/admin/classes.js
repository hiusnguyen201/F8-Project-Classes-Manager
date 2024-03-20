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

router.post(
  "/create",
  csrf.verify,
  validator.make(CLASS_RULES.CREATE),
  ClassController.handleCreateClass
);

router.get("/edit/:name", ClassController.edit);

router.patch(
  "/edit/:name",
  csrf.verify,
  validator.make(CLASS_RULES.EDIT),
  ClassController.handleEditClass
);

router.delete("/", csrf.verify, ClassController.handleDeleteClasses);

// router.get("/import", ClassController.importClassesPage);
// router.post(
//   "/import",
//   fileMiddleware,
//   validator.fileExcel(),
//   ClassController.handleImportClasses
// );
// router.get("/export", ClassController.handleExportClasses);

module.exports = router;
