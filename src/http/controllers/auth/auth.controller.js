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
      redirectPath,
    });
  },

  handleLogin: async (req, res, social = null) => {
    const userId = req.user;
    if (social) {
      res.clearCookie("token");
      const loginToken = await tokensService.createLoginToken(userId);
      res.cookie("token", loginToken.token);
      return res.send("<script>window.close()</script>");
    } else {
      await otpsService.createUserOtp(userId);
      req.flash("success", messageInfo.SENDED_OTP);
      return res.redirect(redirectPath.OTP_AUTH);
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

    const user = req.user;
    const [data, errMessage] = await otpsService.verifyOtp(otp, user.id);

    if (!data) {
      req.flash("error", errMessage);
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
        return next(err);
      }
    });
    await tokensService.removeLoginTokenByToken(tokenCookie);
    return res.redirect(redirectPath.LOGIN_AUTH);
  },
};
//