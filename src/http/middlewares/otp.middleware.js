const otpsService = require("../services/otps.service");
const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  const userOtp = await otpsService.getUserOtpByUserId(userId);
  if (!userOtp) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }
  next();
};
