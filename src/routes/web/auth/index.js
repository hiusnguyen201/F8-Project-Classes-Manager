var express = require("express");
var router = express.Router();
const passport = require("passport");

const AuthController = require("../../../http/controllers/web/auth/auth.controller");

const validator = require("../../../utils/validator");
const { REDIRECT_PATH } = require("../../../constants/path.constant");
const { RULES_REQUEST } = require("../../../constants/rules.constant");
const OTP_RULES = RULES_REQUEST.OTP_RULES;

const AuthMiddleware = require("../../../http/middlewares/web/auth.middleware");
const GuestMiddleware = require("../../../http/middlewares/web/guest.middleware");
const OtpMiddleware = require("../../../http/middlewares/web/otp.middleware");
const JwtTokenMiddleware = require("../../../http/middlewares/web/jwtToken.middleware");
const csrf = require("../../../http/middlewares/web/csrf.middleware");

// Logout
router.get("/logout", AuthMiddleware, AuthController.logout);

// Google Login
router.get("/google/redirect", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: REDIRECT_PATH.AUTH.LOGIN,
    failureMessage: true,
  }),
  (req, res) => {
    if (req.cookies.token) {
      AuthController.handleLinkAccountSocial(req, res);
    } else {
      AuthController.handleSocialLogin(req, res);
    }
  }
);

// Github Login
router.get("/github/redirect", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: REDIRECT_PATH.AUTH.LOGIN,
    failureMessage: true,
  }),
  (req, res) => {
    if (req.cookies.token) {
      AuthController.handleLinkAccountSocial(req, res);
    } else {
      AuthController.handleSocialLogin(req, res);
    }
  }
);

// Facebook Login
router.get("/facebook/redirect", passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: REDIRECT_PATH.AUTH.LOGIN,
    failureMessage: true,
  }),
  (req, res) => {
    if (req.cookies.token) {
      AuthController.handleLinkAccountSocial(req, res);
    } else {
      AuthController.handleSocialLogin(req, res);
    }
  }
);

router.use(GuestMiddleware);
// Otp
router.get("/otp", OtpMiddleware, AuthController.otp);
router.post(
  "/otp",
  OtpMiddleware,
  csrf.verify,
  validator.make(OTP_RULES),
  AuthController.handleOtp
);

// Password
router.get("/passwordreset", AuthController.emailResetPass);
router.post("/passwordreset", csrf.verify, AuthController.handleEmailResetPass);
router.get(
  "/passwordreset/:token",
  JwtTokenMiddleware,
  AuthController.resetPassword
);
router.patch(
  "/passwordreset/:token",
  csrf.verify,
  AuthController.handleResetPassword
);

// Local Login
router.get("/login", AuthController.login);
router.post(
  "/login",
  csrf.verify,
  passport.authenticate("local", {
    failureRedirect: REDIRECT_PATH.AUTH.LOGIN,
    failureFlash: true,
  }),
  AuthController.handleLocalLogin
);

module.exports = router;
