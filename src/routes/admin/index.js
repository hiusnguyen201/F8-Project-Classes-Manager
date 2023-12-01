var express = require("express");
var router = express.Router();

// Admin
const HomeController = require("../..//http/controllers/admin/home.controller");

router.get("/", HomeController.index);
router.get("/settings", HomeController.settings);

module.exports = router;
