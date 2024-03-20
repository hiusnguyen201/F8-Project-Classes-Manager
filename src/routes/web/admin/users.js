var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const USER_RULES = RULES_REQUEST.USER_RULES;
const UserController = require("../../../http/controllers/web/admin/user.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const fileMiddleware = require("../../../http/middlewares/web/file.middleware");
const validator = require("../../../utils/validator");

router.get("/", UserController.index);

router.get("/create", UserController.create);

router.post(
  "/create",
  csrf.verify,
  validator.make(USER_RULES.CREATE),
  UserController.handleCreateUser
);

router.get("/edit/:id", UserController.edit);

router.patch(
  "/edit/:id",
  csrf.verify,
  validator.make(USER_RULES.EDIT),
  UserController.handleEditUser
);

router.delete("/", csrf.verify, UserController.handleDeleteUsers);

router.get("/import", UserController.importUsersPage);

router.post(
  "/import",
  fileMiddleware,
  validator.fileExcel(),
  UserController.handleImportUsers
);

router.get("/export", UserController.handleExportUsers);

module.exports = router;
