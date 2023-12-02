var express = require("express");
var router = express.Router();

// Admin
const HomeController = require("../..//http/controllers/admin/home.controller");
const csrf = require("../../http/middlewares/csrf.middleware");

router.get("/", HomeController.index);

router.get("/settings", HomeController.settings);
router.get("/settings/profile", HomeController.settings);
router.get("/settings/security", HomeController.settings);
router.delete(
  "/settings/security",
  csrf.verify,
  HomeController.handleRemoveUserSocial
);

module.exports = router;
