const tokensService = require("../services/tokens.service");
const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  const tokenCookie = req.cookies.token;

  if (req.session.otpToken) {
    return res.redirect(redirectPath.OTP_AUTH);
  }

  if (!tokenCookie) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  const tokenValid = await tokensService.getLoginTokenByToken(tokenCookie);

  if (!tokenValid) {
    if (req.user) {
      res.clearCookie("token");
    }

    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });

    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  next();
};
