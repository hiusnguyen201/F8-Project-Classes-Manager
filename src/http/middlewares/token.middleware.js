const otpsService = require("../services/otps.service");
const validateTokenUtil = require("../../utils/validateToken.util");
const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  const tokenCookie = req.cookies.token;
  if (req.user) {
    const userOtp = await otpsService.getUserOtpByUserId(+req.user.id);
    if (!tokenCookie && userOtp) {
      return res.redirect(redirectPath.OTP_AUTH);
    } else if (!tokenCookie && !userOtp) {
      return res.redirect(redirectPath.LOGIN_AUTH);
    }

    const tokenValid = await validateTokenUtil(req, res, tokenCookie);
    if (tokenValid) {
      return next();
    }
  } else {
    res.clearCookie("token");
    return res.redirect(redirectPath.LOGIN_AUTH);
  }
};
