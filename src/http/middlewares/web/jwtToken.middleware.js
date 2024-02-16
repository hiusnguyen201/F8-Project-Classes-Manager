const tokenUtil = require("../../../utils/token");
const { MESSAGE_ERROR } = require("../../../constants/message.constant");
const { REDIRECT_PATH } = require("../../../constants/path.constant");

module.exports = (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res.redirect(REDIRECT_PATH.EMAIL_PASS_RESET);
  }

  const userIdReset = tokenUtil.verifyTokenByJwt(token);
  if (!userIdReset) {
    req.flash("error", MESSAGE_ERROR.OTHER.JWT_INVALID_TOKEN);
    return res.redirect(REDIRECT_PATH.EMAIL_PASS_RESET);
  } else if (req.isAuthenticated() && !userIdReset) {
    req.flash("error", MESSAGE_ERROR.OTHER.JWT_INVALID_TOKEN);
    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  }

  next();
};
