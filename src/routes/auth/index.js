//
var express = require("express");
var router = express.Router();
const passport = require("passport");

// Auth
const AuthController = require("../../http/controllers/auth/auth.controller");
const AuthMiddleware = require("../../http/middlewares/auth.middleware");
const TokenMiddleware = require("../../http/middlewares/token.middleware");
const GuestMiddleware = require("../../http/middlewares/guest.middleware");
const { redirectPath } = require("../../constants/constants.path");
const { messageInfo } = require("../../constants/constants.message");

// Local Login
router.get("/login", GuestMiddleware, AuthController.login);
router.post(
  "/login",
  GuestMiddleware,
  passport.authenticate("local", {
    failureRedirect: redirectPath.LOGIN_AUTH,
    failureFlash: true,
  }),
  (req, res) => {
    AuthController.handleLogin(req, res, null);
  }
);

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
  (req, res) => {
    AuthController.handleLogin(req, res, "google");
  }
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
  (req, res) => {
    AuthController.handleLogin(req, res, "github");
  }
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
  (req, res) => {
    AuthController.handleLogin(req, res, "facebook");
  }
);

router.use(AuthMiddleware);
router.get("/otp", GuestMiddleware, AuthController.otp);
router.post("/otp", GuestMiddleware, AuthController.handleOtp);
router.get("/logout", TokenMiddleware, AuthController.logout);

module.exports = router;
