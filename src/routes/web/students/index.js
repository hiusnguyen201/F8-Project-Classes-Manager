var express = require("express");
var router = express.Router();

// Student
const HomeController = require("../../../http/controllers/web/students/home.controller");

router.get("/", HomeController.index);

module.exports = router;
