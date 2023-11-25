//
var express = require("express");
var router = express.Router();

// Teacher
const HomeController = require("../..//http/controllers/teachers/home.controller");

router.get("/", HomeController.index);

module.exports = router;
