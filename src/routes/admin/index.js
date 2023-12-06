var express = require("express");
var router = express.Router();

// Admin
const HomeController = require("../..//http/controllers/admin/home.controller");
const SettingController = require("../..//http/controllers/admin/setting.controller");
const csrf = require("../../http/middlewares/csrf.middleware");
const {
  validateChangePassword,
  validateUserProfile,
} = require("../../utils/validator");

// Home
router.get("/", HomeController.index);

// Setting
router.get("/settings", SettingController.settings);
router.get("/settings/profile", SettingController.settings);
router.patch(
  "/settings/profile",
  csrf.verify,
  validateUserProfile(),
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
  validateChangePassword(),
  SettingController.handleChangePassword
);

module.exports = router;
