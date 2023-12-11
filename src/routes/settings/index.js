var express = require("express");
var router = express.Router();

const SettingController = require("../../http/controllers/settings/home.controller");

const validator = require("../../utils/validator");

const csrf = require("../../http/middlewares/csrf.middleware");

router.get("/", SettingController.settings);

router.get("/profile", SettingController.settings);
router.patch(
  "/profile",
  csrf.verify,
  validator.validateUserProfile(),
  SettingController.handleUpdateProfile
);

router.get("/security", SettingController.settings);
router.delete(
  "/security",
  csrf.verify,
  SettingController.handleRemoveUserSocial
);

router.get("/password", SettingController.settings);
router.patch(
  "/password",
  csrf.verify,
  validator.validateLoginAndPassword(
    "oldPassword",
    "newPassword",
    "confirmPassword"
  ),
  SettingController.handleChangePassword
);
module.exports = router;
