const tokensService = require("../services/tokens.service");
const otpsService = require("../services/otps.service");
const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  const user = req.user;
  const tokenCookie = req.cookies.token;

  if (!user) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  const userOtp = await otpsService.getUserOtpByUserId(user.id);
  if (userOtp && !tokenCookie) {
    return res.redirect(redirectPath.OTP_AUTH);
  }

  const tokenValid = await tokensService.getLoginTokenByToken(tokenCookie);
  if (!tokenValid) {
    res.clearCookie("token");
    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  await otpsService.removeUserOtpByUserId(user.id);
  next();
};
