var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const USER_RULES = RULES_REQUEST.USER_RULES;
const SettingController = require("../../../http/controllers/web/admin/setting.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const validator = require("../../../utils/validator");

router.get("/profile", SettingController.profile);
router.patch(
  "/profile",
  csrf.verify,
  validator.make(USER_RULES.EDIT),
  SettingController.handleEditProfile
);

router.get("/security", SettingController.security);
router.delete(
  "/security",
  csrf.verify,
  SettingController.handleRemoveUserSocial
);

router.get("/password", SettingController.password);
router.patch(
  "/password",
  csrf.verify,
  validator.make(USER_RULES.CHANGE_PASS),
  SettingController.handleChangePassword
);

module.exports = router;
