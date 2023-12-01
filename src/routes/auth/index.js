//
var express = require("express");
var router = express.Router();
const passport = require("passport");

// Auth
const AuthController = require("../../http/controllers/auth/auth.controller");
const AuthMiddleware = require("../../http/middlewares/auth.middleware");
const GuestMiddleware = require("../../http/middlewares/guest.middleware");
const TokenMiddleware = require("../../http/middlewares/token.middleware");
const { redirectPath } = require("../../constants/constants.path");

router.get("/logout", TokenMiddleware, AuthController.logout);

router.get("/login", GuestMiddleware, AuthController.login);
router.post(
  "/login",
  GuestMiddleware,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: redirectPath.LOGIN_AUTH,
  }),
  (req, res) => {
    AuthController.handleLogin(req, res, null);
  }
);

router.get("/google/redirect", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      AuthController.handleLogin(req, res, "google");
    } else {
      return res.send("<script>window.close()</script>");
    }
  }
);

router.get("/otp", AuthMiddleware, AuthController.otp);
router.post("/otp", AuthMiddleware, AuthController.handleOtp);

module.exports = router;
