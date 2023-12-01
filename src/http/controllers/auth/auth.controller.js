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
const momentUtil = require("../../../utils/moment.util");
const validateTokenUtil = require("../../../utils/validateToken.util");

const checkType = (res, user) => {
  if (user.type_id === 1) {
    return res.redirect(redirectPath.HOME_ADMIN);
  } else if (user.type_id === 2) {
    return res.redirect(redirectPath.HOME_TEACHER);
  } else if (user.type_id === 3) {
    return res.redirect(redirectPath.HOME_STUDENT);
  }
};

module.exports = {
  login: (req, res) => {
    const errors = req.flash("error");

    if (errors[0] === "Missing credentials") {
      errors[0] = messageError.MISSING_CREDENTIALS;
    }

    res.render(renderPath.LOGIN_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Login - ${process.env.APP_NAME} Accounts`,
      errors,
    });
  },

  handleLogin: async (req, res, social = null) => {
    if (social) {
      await tokensService.createLoginToken(res, +req.user.id);
      checkType(res, req.user);
    } else {
      await otpsService.createUserOtp(req.user);
      req.flash("success", messageInfo.SENDED_OTP);
      res.redirect(redirectPath.OTP_AUTH);
    }
  },

  otp: (req, res) => {
    const success = req.flash("success");
    const error = req.flash("error");
    res.render(renderPath.OTP_AUTH, {
      layout: "layouts/auth.layout.ejs",
      title: `Verify Otp - ${process.env.APP_NAME} Accounts`,
      loginPath: redirectPath.LOGIN_AUTH,
      success,
      error,
    });
  },

  handleOtp: async (req, res) => {
    const { ...params } = req.body;
    const otp = params.otp.reduce((acc, curr) => acc + curr);

    if (!otp) {
      req.flash("error", messageError.EMPTY_OTP);
      return res.redirect(redirectPath.OTP_AUTH);
    }

    const userOtp = await otpsService.getUserOtpByUserId(+req.user.id);

    if (
      momentUtil.comparisonDate(userOtp.expire, momentUtil.getDateNow()) > 0
    ) {
      req.flash("error", messageError.OTP_EXPIRE);
      return res.redirect(redirectPath.OTP_AUTH);
    }

    if (otp !== userOtp.otp) {
      req.flash("error", messageError.WRONG_OTP);
      return res.redirect(redirectPath.OTP_AUTH);
    }
    otpsService.removeUserOtpByOtp(+otp);

    await tokensService.createLoginToken(res, +req.user.id);

    checkType(res, req.user);
  },

  logout: async (req, res) => {
    const tokenCookie = req.cookies.token;
    const tokenValid = await validateTokenUtil(req, res, tokenCookie);
    if (tokenValid) {
      res.clearCookie("token");
      req.logout((err) => {
        if (err) {
          return next(err);
        }
      });
      tokensService.removeLoginTokenByObj(tokenValid);
      return res.redirect(redirectPath.LOGIN_AUTH);
    }
  },
};
//