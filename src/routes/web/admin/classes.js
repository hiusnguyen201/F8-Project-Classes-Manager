var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const ClassController = require("../../../http/controllers/web/admin/class.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");
const validator = require("../../../utils/validator");

router.get("/classes", ClassController.index);
router.post("/classes", csrf.verify, ClassController.handleCreateClass);

// router.patch(
//   "/classes",
//   csrf.verify,
//   ClassController.handleEditClass
// );
// router.delete(
//   "/classes",
//   csrf.verify,
//   ClassController.handleDeleteClasses
// );

// router.get("/classes/import", ClassController.importClassesPage);
// router.post(
//   "/classes/import",
//   fileMiddleware,
//   validator.fileExcel(),
//   ClassController.handleImportClasses
// );
// router.get("/classes/export", ClassController.handleExportClasses);

module.exports = router;
