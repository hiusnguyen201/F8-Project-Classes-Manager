const tokenUtil = require("../../utils/token.util");
const { messageError } = require("../../constants/constants.message");
const { redirectPath } = require("../../constants/constants.path");

module.exports = (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res.redirect(redirectPath.EMAIL_PASS_RESET);
  }

  const userIdReset = tokenUtil.verifyTokenByJwt(token);
  if (!userIdReset) {
    req.flash("error", messageError.JWT_INVALID_TOKEN);
    return res.redirect(redirectPath.EMAIL_PASS_RESET);
  } else if (req.user && !userIdReset) {
    req.flash("error", messageError.JWT_INVALID_TOKEN);
    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  next();
};
