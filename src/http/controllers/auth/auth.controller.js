const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");
const {
  messageError,
  messageInfo,
} = require("../../../constants/constants.message");
const sendMail = require("../../../helpers/nodemailer.helper");
const job = require("../../../helpers/kue.helper");
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
    });
  },

  handleLogin: async (req, res) => {
    // Create Otp
    const userOtp = await otpsService.createOtp(+req.user.id);

    const mailTemplate = otpsService.getMailTemplate(
      req.user.name,
      userOtp.otp
    );

    // Send Mail
    job.createJob(
      "SendMail",
      {
        title: messageInfo.TWO_FA,
        to: req.user.email,
        name: req.user.name,
      },
      sendMail(req.user.email, messageInfo.TWO_FA, mailTemplate)
    );

    req.session.otpToken = userOtp.otp;

    setTimeout(async () => {
      const userOtp = await otpsService.getUserOtpByOtp(+req.session.otpToken);
      if (userOtp) {
        otpsService.removeUserOtpByOtp(+req.session.otpToken);
      }
    }, 60000 * process.env.OTP_EXPIRE_MINUTES);

    req.flash("success", messageInfo.SENDED_OTP);
    res.redirect(redirectPath.OTP_AUTH);
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

    const userOtp = await otpsService.getUserOtpByOtp(+req.session.otpToken);
    if (!userOtp && req.session.otpToken) {
      req.flash("error", messageError.OTP_EXPIRE);
      delete req.session.otpToken;
      return res.redirect(redirectPath.OTP_AUTH);
    }

    if (otp !== req.session.otpToken) {
      req.flash("error", messageError.WRONG_OTP);
      return res.redirect(redirectPath.OTP_AUTH);
    }

    otpsService.removeUserOtpByOtp(+otp);
    delete req.session.otpToken;
    const loginToken = await tokensService.getLoginTokenByUserId(+req.user.id);

    if (loginToken) {
      tokensService.removeLoginTokenByObj(loginToken);
      res.clearCookie("token");
    }

    const newLoginToken = await tokensService.createLoginToken(+req.user.id);
    res.cookie("token", newLoginToken.token);

    const { Type: userType } = req.user;
    if (userType.name === "student") {
      res.redirect(redirectPath.HOME_STUDENT);
    } else if (userType.name === "teacher") {
      res.redirect(redirectPath.HOME_TEACHER);
    } else if (userType.name === "admin") {
      res.redirect(redirectPath.HOME_ADMIN);
    }
  },
};
//