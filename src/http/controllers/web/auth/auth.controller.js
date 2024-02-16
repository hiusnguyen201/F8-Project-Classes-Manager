const { validationResult } = require("express-validator");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} = require("../../../../constants/message.constant");
const otpService = require("../../../services/otp.service");
const tokenService = require("../../../services/token.service");
const userService = require("../../../services/user.service");
const tokenUtil = require("../../../../utils/token");
const csrf = require("../../../middlewares/web/csrf.middleware");
module.exports = {
  login: (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    if (error[0] === "Missing credentials") {
      error[0] = MESSAGE_ERROR.USER.MISSING_CREDENTIALS;
    }

    return res.render(RENDER_PATH.LOGIN_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Login - ${process.env.APP_NAME} Accounts`,
      error,
      success,
      csrf,
      REDIRECT_PATH,
    });
  },

  handleLocalLogin: async (req, res) => {
    const user = req.user;

    if (!user.firstLogin) {
      const tokenReset = tokenUtil.createTokenByJwt(user.id);
      return res.redirect(`${REDIRECT_PATH.EMAIL_PASS_RESET}/${tokenReset}`);
    }

    const [userOtp, message] = await otpService.createUserOtp(
      user.id,
      user.email,
      user.name
    );

    if (userOtp) {
      req.flash("success", message);
      return res.redirect(REDIRECT_PATH.OTP_AUTH);
    } else {
      req.flash("error", message);
      return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
    }
  },

  otp: (req, res) => {
    const success = req.flash("success");
    const error = req.flash("error");

    return res.render(RENDER_PATH.OTP_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Verify Otp - ${process.env.APP_NAME} Accounts`,
      REDIRECT_PATH,
      success,
      error,
      csrf,
    });
  },

  handleOtp: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.OTP_AUTH);
    }

    const { ...params } = req.body;
    const otp = params.otp.join("");
    const user = req.user;

    const [loginToken, message] = await otpService.verifyOtp(otp, user.id);

    if (!loginToken) {
      req.flash("error", message);
      if (message === MESSAGE_ERROR.OTP.OTP_EXPIRE) {
        return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
      } else {
        return res.redirect(REDIRECT_PATH.OTP_AUTH);
      }
    }

    res.cookie("token", loginToken.token);

    const { Type } = user;
    if (Type.name === "admin") {
      return res.redirect(REDIRECT_PATH.HOME_ADMIN);
    } else if (Type.name === "teacher") {
      return res.redirect(REDIRECT_PATH.HOME_TEACHER);
    } else {
      return res.redirect(REDIRECT_PATH.HOME_STUDENT);
    }
  },

  handleSocialLogin: async (req, res) => {
    const tokenCookie = req.cookies.token;
    if (tokenCookie) {
      req.flash("success", MESSAGE_SUCCESS.SOCIAL.LINK_ACCOUNT_SOCIAL_SUCCESS);
    } else {
      const userId = req.user.id;

      if (!Number.isInteger(+userId)) {
        return res.send("<script>window.close()</script>");
      }

      const [loginToken, message] = await tokenService.createLoginToken(userId);
      if (!loginToken) {
        req.flash("error", message);
        return res.send("<script>window.close()</script>");
      }

      res.cookie("token", loginToken.token);
    }

    return res.send("<script>window.close()</script>");
  },

  logout: async (req, res) => {
    const tokenCookie = req.cookies.token;
    req.logout((err) => {
      if (err) {
        console.log(err);
        req.flash("error", MESSAGE_ERROR.USER.LOGOUT_FAILED);
        return res.redirect(req.url);
      }
    });

    const [status, message] = await tokenService.removeLoginToken({
      token: tokenCookie,
    });

    if (status) {
      res.clearCookie("token");
      return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
    } else {
      req.flash("error", message);
    }

    return res.redirect(req.url);
  },

  emailResetPass: (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    return res.render(RENDER_PATH.EMAIL_PASS_RESET, {
      layout: "layouts/auth.layout.ejs",
      title: `Reset Password - ${process.env.APP_NAME} Accounts`,
      REDIRECT_PATH,
      error,
      csrf,
      success,
    });
  },

  handleEmailResetPass: async (req, res) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.EMAIL_PASS_RESET);
    }

    const { email } = req.body;
    const [status, message] = await userService.sendResetPassLink(email);
    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }
    return res.redirect(REDIRECT_PATH.EMAIL_PASS_RESET);
  },

  resetPassword: async (req, res) => {
    const error = req.flash("error");

    return res.render(RENDER_PATH.RESET_PASSWORD_LINK, {
      layout: "layouts/auth.layout.ejs",
      title: `Reset Password - ${process.env.APP_NAME} Accounts`,
      REDIRECT_PATH,
      error,
      csrf,
    });
  },

  handleResetPassword: async (req, res) => {
    const { token } = req.params;
    const userIdReset = tokenUtil.verifyTokenByJwt(token);

    const { errors } = validationResult(req);
    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(REDIRECT_PATH.RESET_PASSWORD_LINK);
    }

    const { confirmPassword } = req.body;
    const [status, message] = await userService.updatePassword(
      +userIdReset,
      confirmPassword
    );
    if (status) {
      req.flash("success", message);
    } else {
      req.flash("error", message);
    }

    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  },
};
