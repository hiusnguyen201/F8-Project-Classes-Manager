const { validationResult } = require("express-validator");
const {
  RENDER_PATH,
  REDIRECT_PATH,
} = require("../../../../constants/path.constant");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} = require("../../../../constants/message.constant");

const csrf = require("../../../middlewares/web/csrf.middleware");

const tokenUtil = require("../../../../utils/token");
const classifyRedirect = require("../../../../utils/classifyRedirect");

const OtpService = require("../../../services/otp.service");
const otpService = new OtpService();
const TokenService = require("../../../services/token.service");
const tokenService = new TokenService();
const UserService = require("../../../services/user.service");
const userService = new UserService();
const SocialService = require("../../../services/social.service");
const userSocialService = new SocialService();

module.exports = {
  login: (req, res) => {
    const error = req.flash("error");

    if (error[0] === "Missing credentials") {
      error[0] = MESSAGE_ERROR.USER.MISSING_CREDENTIALS;
    }

    return res.render(RENDER_PATH.LOGIN_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Login - ${process.env.APP_NAME} Accounts`,
      error,
      csrf,
      REDIRECT_PATH,
    });
  },

  handleLocalLogin: async (req, res) => {
    try {
      const user = req.user;
      await otpService.create(user.id, user.email, user.name);
      req.flash("success", MESSAGE_SUCCESS.OTP.SENDED_OTP);
      return res.redirect(REDIRECT_PATH.OTP_AUTH);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.OTP.CREATE_OTP_FAILED);
      return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
    }
  },

  otp: (req, res) => {
    const errors = req.flash("errors")[0];
    let error = req.flash("error")[0];

    if (errors) {
      for (let err in errors) {
        error = errors[err];
      }
    }

    return res.render(RENDER_PATH.OTP_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Verify Otp - ${process.env.APP_NAME} Accounts`,
      REDIRECT_PATH,
      success: req.flash("success"),
      error,
      csrf,
    });
  },

  handleOtp: async (req, res) => {
    try {
      let { otp } = req.body;
      otp = otp.join("");

      if (!Number.isInteger(+otp))
        throw new Error(MESSAGE_ERROR.OTP.INVALID_OTP);

      const user = req.user;
      await otpService.verify(otp);
      const loginToken = await tokenService.create(user.id);

      if (loginToken) {
        if (!user.firstLogin) {
          const tokenReset = tokenUtil.createTokenByJwt(user.id);
          req.session.firstLogin = loginToken.token;
          return res.redirect(
            `${REDIRECT_PATH.EMAIL_PASS_RESET}/${tokenReset}`
          );
        }

        res.cookie("token", req.session.firstLogin);
        return res.redirect(
          classifyRedirect(user.Type.name, [
            REDIRECT_PATH.HOME_ADMIN,
            REDIRECT_PATH.HOME_TEACHER,
            REDIRECT_PATH.HOME_STUDENT,
          ])
        );
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
    }
    return res.redirect(REDIRECT_PATH.OTP_AUTH);
  },

  handleSocialLogin: async (req, res) => {
    const user = req.user;
    try {
      const loginToken = await tokenService.create(user.id);

      if (loginToken) {
        res.cookie("token", loginToken.token);
      }
    } catch (err) {
      console.log(err);
    }

    return res.redirect(
      classifyRedirect(user.Type.name, [
        REDIRECT_PATH.HOME_ADMIN,
        REDIRECT_PATH.HOME_TEACHER,
        REDIRECT_PATH.HOME_STUDENT,
      ])
    );
  },

  handleLinkAccountSocial: async (req, res) => {
    const user = req.user;

    try {
      const { profile } = req.cookies;
      delete req.cookies.profile;
      await userSocialService.create(
        profile.providerId,
        profile.provider,
        user.id
      );
      req.flash("success", MESSAGE_SUCCESS.SOCIAL.LINK_ACCOUNT_SOCIAL_SUCCESS);
    } catch (err) {
      console.log(err);
      req.flash("success", MESSAGE_ERROR.SOCIAL.LINK_ACCOUNT_FAILED);
    }

    return res.redirect(
      classifyRedirect(user.Type.name, [
        REDIRECT_PATH.SECURITY_SETTING_ADMIN,
        REDIRECT_PATH.SETTINGS_SECURITY_TEACHER,
        REDIRECT_PATH.SETTINGS_SECURITY_STUDENT,
      ])
    );
  },

  logout: async (req, res) => {
    const tokenCookie = req.cookies.token;
    req.logout((err) => {
      if (err) {
        console.log(err);
        req.flash("error", MESSAGE_ERROR.USER.LOGOUT_FAILED);
      }
    });

    try {
      res.clearCookie("token");
      await tokenService.remove(tokenCookie);
      return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.USER.LOGOUT_FAILED);
    }

    return res.redirect(req.url);
  },

  emailResetPass: (req, res) => {
    return res.render(RENDER_PATH.EMAIL_PASS_RESET, {
      layout: "layouts/auth.layout.ejs",
      title: `Reset Password - ${process.env.APP_NAME} Accounts`,
      REDIRECT_PATH,
      error: req.flash("error"),
      success: req.flash("success"),
      csrf,
    });
  },

  handleEmailResetPass: async (req, res) => {
    try {
      await userService.sendResetPassLink(req.body.email);
      req.flash("success", MESSAGE_SUCCESS.USER.SENDED_RESET_PASS);
    } catch (err) {
      console.log(err);
      req.flash("error", MESSAGE_ERROR.OTHER.SEND_MAIL_FAILED);
    }

    return res.redirect(REDIRECT_PATH.EMAIL_PASS_RESET);
  },

  resetPassword: async (req, res) => {
    return res.render(RENDER_PATH.RESET_PASSWORD_LINK, {
      layout: "layouts/auth.layout.ejs",
      title: `Reset Password - ${process.env.APP_NAME} Accounts`,
      REDIRECT_PATH,
      error: req.flash("error"),
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
    await userService.changePassword(+userIdReset, confirmPassword);

    if (req.session.firstLogin) {
      const user = req.user;
      res.cookie("token", req.session.firstLogin);
      delete req.session.firstLogin;
      return res.redirect(
        classifyRedirect(user.Type.name, [
          REDIRECT_PATH.HOME_ADMIN,
          REDIRECT_PATH.HOME_TEACHER,
          REDIRECT_PATH.HOME_STUDENT,
        ])
      );
    }

    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  },
};
