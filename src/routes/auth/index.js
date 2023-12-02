var express = require("express");
var router = express.Router();
const passport = require("passport");

// Auth
const AuthController = require("../../http/controllers/auth/auth.controller");
const AuthMiddleware = require("../../http/middlewares/auth.middleware");
const TokenMiddleware = require("../../http/middlewares/token.middleware");
const GuestMiddleware = require("../../http/middlewares/guest.middleware");
const { redirectPath } = require("../../constants/constants.path");

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

router.get("/google/redirect", passport.authenticate("google"));
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, user, info, status) => {
      const token = req.cookies.token;
      if (err) {
        return next(err);
      }

      if (!user) {
        if (!token) {
          req.flash("error", info.message);
          return res.redirect(redirectPath.LOGIN_AUTH);
        } else {
          req.flash("error", info.message);
          return res.send("<script>window.close()</script>");
        }
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }

        next();
      });
    })(req, res, next);
  },
  async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      AuthController.handleLogin(req, res, "google");
    } else {
      res.send("<script>window.close()</script>");
    }
  }
);

router.use(AuthMiddleware);
router.get("/otp", GuestMiddleware, AuthController.otp);
router.post("/otp", GuestMiddleware, AuthController.handleOtp);
router.get("/logout", TokenMiddleware, AuthController.logout);

module.exports = router;
