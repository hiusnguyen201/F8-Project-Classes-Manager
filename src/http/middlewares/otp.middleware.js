const otpsService = require("../services/otps.service");
const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  const userOtp = await otpsService.getUserOtpByUserId(+user.id);
  if (!userOtp) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }
  next();
};
