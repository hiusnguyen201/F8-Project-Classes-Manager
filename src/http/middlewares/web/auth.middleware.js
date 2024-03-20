const TokenService = require("../../services/token.service");
const tokenService = new TokenService();
const { REDIRECT_PATH } = require("../../../constants/path.constant");
const { MESSAGE_ERROR } = require("../../../constants/message.constant");

module.exports = async (req, res, next) => {
  if (!req.user) {
    res.clearCookie("token");
    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  }

  const tokenCookie = req.cookies?.token;
  if (!tokenCookie) {
    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  }

  try {
    const tokenValid = await tokenService.findByToken(tokenCookie);

    if (!tokenValid) {
      res.clearCookie("token");
      return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
    }

    next();
  } catch (err) {
    console.log(err);
    req.flash("error", MESSAGE_ERROR.TOKEN.VERIFY_TOKEN_FAILED);
    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  }
};
