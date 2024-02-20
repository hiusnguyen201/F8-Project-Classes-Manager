var express = require("express");
var router = express.Router();

const { RULES_REQUEST } = require("../../../constants/rules.constant");
const SettingController = require("../../../http/controllers/web/admin/setting.controller");
const csrf = require("../../../http/middlewares/web/csrf.middleware");
const validator = require("../../../utils/validator");

router.get("/settings", SettingController.settings);
router.get("/settings/profile", SettingController.settings);
router.patch(
  "/settings/profile",
  csrf.verify,
  SettingController.handleUpdateProfile
);
router.get("/settings/security", SettingController.settings);
router.delete(
  "/settings/security",
  csrf.verify,
  SettingController.handleRemoveUserSocial
);
router.get("/settings/password", SettingController.settings);
router.patch(
  "/settings/password",
  csrf.verify,
  SettingController.handleChangePassword
);

module.exports = router;
