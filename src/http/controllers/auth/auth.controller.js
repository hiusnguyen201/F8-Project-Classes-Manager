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
    const user = req.user;
    if (social) {
      res.clearCookie("token");
      const loginToken = await tokensService.createLoginToken(+user.id);
      res.cookie("token", loginToken.token);
      checkType(res, user);
    } else {
      await otpsService.createUserOtp(user);
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

    const user = req.user;
    const [data, errMessage] = await otpsService.verifyOtp(otp, user.id);

    if (!data) {
      req.flash("error", errMessage);
      return res.redirect(redirectPath.OTP_AUTH);
    }

    console.log(data);

    res.cookie("token", data.token);
    checkType(res, req.user);
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
