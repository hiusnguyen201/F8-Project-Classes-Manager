const tokenService = require("../../services/token.service");
const { REDIRECT_PATH } = require("../../../constants/path.constant");
const { MESSAGE_ERROR } = require("../../../constants/message.constant");

module.exports = async (req, res, next) => {
  const tokenCookie = req.cookies?.token;

  if (!tokenCookie || !req.isAuthenticated()) {
    res.clearCookie("token");
    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  }

  try {
    const [tokenValid] = await tokenService.getLoginToken({
      token: tokenCookie,
    });

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
