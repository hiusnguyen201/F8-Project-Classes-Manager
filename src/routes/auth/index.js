//
var express = require("express");
var router = express.Router();
const passport = require("passport");

const AuthController = require("../../http/controllers/auth/auth.controller");

const validator = require("../../utils/validator");
const { redirectPath } = require("../../constants/constants.path");

const AuthMiddleware = require("../../http/middlewares/auth.middleware");
const GuestMiddleware = require("../../http/middlewares/guest.middleware");
const OtpMiddleware = require("../../http/middlewares/otp.middleware");
const csrf = require("../../http/middlewares/csrf.middleware");
const JwtTokenMiddleware = require("../../http/middlewares/jwtToken.middleware");

// Logout
router.get("/logout", AuthMiddleware, AuthController.logout);

// Google Login
router.get("/google/redirect", passport.authenticate("google"));
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info, status) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.flash("error", info.message);
        return res.send("<script>window.close()</script>");
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        next();
      });
    })(req, res, next);
  },
  AuthController.handleSocialLogin
);

// Github Login
router.get("/github/redirect", passport.authenticate("github"));
router.get(
  "/github/callback",
  (req, res, next) => {
    passport.authenticate("github", (err, user, info, status) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.flash("error", info.message);
        return res.send("<script>window.close()</script>");
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        next();
      });
    })(req, res, next);
  },
  AuthController.handleSocialLogin
);

// Facebook Login
router.get("/facebook/redirect", passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  (req, res, next) => {
    passport.authenticate("facebook", (err, user, info, status) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.flash("error", info.message);
        return res.send("<script>window.close()</script>");
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        next();
      });
    })(req, res, next);
  },
  AuthController.handleSocialLogin
);

router.use(GuestMiddleware);
// Local Login
router.get("/login", AuthController.login);
router.post(
  "/login",
  csrf.verify,
  validator.validateLoginAndPassword("email", "password"),
  passport.authenticate("local", {
    failureRedirect: redirectPath.LOGIN_AUTH,
    failureFlash: true,
  }),
  AuthController.handleLocalLogin
);

// Password
router.get("/passwordreset", AuthController.emailResetPass);
router.post(
  "/passwordreset",
  csrf.verify,
  validator.validateLoginAndPassword("email"),
  AuthController.handleEmailResetPass
);
router.get(
  "/passwordreset/:token",
  JwtTokenMiddleware,
  AuthController.resetPassword
);
router.patch(
  "/passwordreset/:token",
  csrf.verify,
  validator.validateLoginAndPassword("newPassword", "confirmPassword"),
  AuthController.handleResetPassword
);

router.use(OtpMiddleware);
// Otp
router.get("/otp", AuthController.otp);
router.post("/otp", csrf.verify, AuthController.handleOtp);

module.exports = router;
