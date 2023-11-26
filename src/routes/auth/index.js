//
var express = require("express");
var router = express.Router();
const passport = require("passport");

// Auth
const AuthController = require("../../http/controllers/auth/auth.controller");
const AuthMiddleware = require("../../http/middlewares/auth.middleware");
const { redirectPath } = require("../../constants/constants.path");

router.get("/login", AuthController.login);
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: redirectPath.LOGIN_AUTH,
  }),
  AuthController.handleLogin
);

router.get("/otp", AuthMiddleware, AuthController.otp);
router.post("/otp", AuthController.handleOtp);

module.exports = router;
