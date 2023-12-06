const { validationResult } = require("express-validator");
const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");
const {
  messageError,
  messageInfo,
} = require("../../../constants/constants.message");
const otpsService = require("../../services/otps.service");
const tokensService = require("../../services/tokens.service");
const usersService = require("../..//services/users.service");
const tokenUtil = require("../../../utils/token.util");
const csrf = require("../../middlewares/csrf.middleware");

module.exports = {
  login: (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    if (error[0] === "Missing credentials") {
      error[0] = messageError.MISSING_CREDENTIALS;
    }

    return res.render(renderPath.LOGIN_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Login - ${process.env.APP_NAME} Accounts`,
      error,
      success,
      csrf,
      redirectPath,
    });
  },

  handleLogin: async (req, res, social = null) => {
    const userId = req.user;
    const token = req.cookies.token;
    if (social) {
      if (token) {
        req.flash("success", messageInfo.LINK_ACCOUNT_SOCIAL_SUCCESS);
      } else {
        res.clearCookie("token");
        const loginToken = await tokensService.createLoginToken(userId);
        res.cookie("token", loginToken.token);
      }
      return res.send("<script>window.close()</script>");
    } else {
      const user = await usersService.getUserById(req.user);
      if (!user.first_login) {
        const tokenReset = tokenUtil.createTokenByJwt(user.id);
        return res.redirect(`${redirectPath.EMAIL_PASS_RESET}/${tokenReset}`);
      }
      await otpsService.createUserOtp(userId);
      req.flash("success", messageInfo.SENDED_OTP);
      return res.redirect(redirectPath.OTP_AUTH);
    }
  },

  otp: (req, res) => {
    const success = req.flash("success");
    const error = req.flash("error");
    return res.render(renderPath.OTP_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Verify Otp - ${process.env.APP_NAME} Accounts`,
      redirectPath,
      success,
      error,
      csrf,
    });
  },

  handleOtp: async (req, res) => {
    const { ...params } = req.body;
    const otp = params.otp.reduce((acc, curr) => acc + curr);

    if (!otp) {
      req.flash("error", messageError.EMPTY_OTP);
      return res.redirect(redirectPath.OTP_AUTH);
    }

    const user = req.user;
    const [data, errMessage] = await otpsService.verifyOtp(otp, user.id);

    if (!data) {
      req.flash("error", errMessage);
      if (errMessage === messageError.OTP_EXPIRE)
        return res.redirect(redirectPath.LOGIN_AUTH);
      return res.redirect(redirectPath.OTP_AUTH);
    }

    res.cookie("token", data.token);
    return res.redirect(redirectPath.HOME_STUDENT);
  },

  logout: async (req, res) => {
    const tokenCookie = req.cookies.token;
    res.clearCookie("token");
    req.logout((err) => {
      if (err) {
        console.log(err);
      }
    });
    await tokensService.removeLoginTokenByToken(tokenCookie);
    return res.redirect(redirectPath.LOGIN_AUTH);
  },

  emailResetPass: (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    return res.render(renderPath.EMAIL_PASS_RESET, {
      layout: "layouts/auth.layout.ejs",
      title: `Reset Password - ${process.env.APP_NAME} Accounts`,
      redirectPath,
      error,
      csrf,
      success,
    });
  },

  handleEmailResetPass: async (req, res) => {
    let { errors } = validationResult(req);
    if (errors[0]?.msg === "Invalid value") {
      errors = [];
    }

    if (errors?.length) {
      req.flash("error", errors[0].msg);
      return res.redirect(redirectPath.EMAIL_PASS_RESET);
    }
    const { email } = req.body;
    const [status, message] = await usersService.sendResetPassLink(email);
    if (!status) {
      req.flash("error", message);
    } else {
      req.flash("success", message);
    }
    return res.redirect(redirectPath.EMAIL_PASS_RESET);
  },

  resetPassword: async (req, res) => {
    const { token: tokenReset } = req.params;

    if (!tokenReset) {
      return res.redirect(redirectPath.EMAIL_PASS_RESET);
    }

    const userIdReset = tokenUtil.verifyTokenByJwt(tokenReset);
    if (req.user && !userIdReset) {
      req.flash("error", messageError.JWT_INVALID_TOKEN);
      return res.redirect(redirectPath.LOGIN_AUTH);
    } else if (!userIdReset) {
      req.flash("error", messageError.JWT_INVALID_TOKEN);
      return res.redirect(redirectPath.EMAIL_PASS_RESET);
    }

    const error = req.flash("error");

    return res.render(renderPath.RESET_PASSWORD_LINK, {
      layout: "layouts/auth.layout.ejs",
      title: `Reset Password - ${process.env.APP_NAME} Accounts`,
      redirectPath,
      error,
      csrf,
    });
  },

  handleResetPassword: async (req, res) => {
    const { token: tokenReset } = req.params;

    if (!tokenReset) {
      return res.redirect(redirectPath.EMAIL_PASS_RESET);
    }

    const userIdReset = tokenUtil.verifyTokenByJwt(tokenReset);
    if (req.user && !userIdReset) {
      req.flash("error", messageError.JWT_INVALID_TOKEN);
      return res.redirect(redirectPath.LOGIN_AUTH);
    } else if (!userIdReset) {
      req.flash("error", messageError.JWT_INVALID_TOKEN);
      return res.redirect(redirectPath.EMAIL_PASS_RESET);
    }

    let { errors } = validationResult(req);
    if (errors[0]?.msg === "Invalid value") {
      errors = [];
    }

    if (!errors?.length) {
      const { confirmPassword } = req.body;
      if (req.user) {
        usersService.updatePassword(userIdReset, confirmPassword, "active");
      } else {
        usersService.updatePassword(userIdReset, confirmPassword);
      }
      req.flash("success", messageInfo.CHANGE_PASS_SUCCESS);
      return res.redirect(redirectPath.LOGIN_AUTH);
    } else {
      req.flash("error", errors[0].msg);
      return res.redirect(redirectPath.RESET_PASSWORD_LINK);
    }
  },
};
