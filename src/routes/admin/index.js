var express = require("express");
var router = express.Router();

// Admin
const HomeController = require("../../http/controllers/admin/home.controller");

// Home
router.get("/", HomeController.index);
router.get("/users", HomeController.usersIndex);

module.exports = router;
