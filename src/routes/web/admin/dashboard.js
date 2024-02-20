var express = require("express");
var router = express.Router();

// Admin
const HomeController = require("../../../http/controllers/web/admin/home.controller");

router.get("/", HomeController.index);

module.exports = router;
