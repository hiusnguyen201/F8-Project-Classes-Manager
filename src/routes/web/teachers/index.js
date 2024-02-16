var express = require("express");
var router = express.Router();

// Teacher
const HomeController = require("../../../http/controllers/web/teachers/home.controller");

router.get("/", HomeController.index);

module.exports = router;
