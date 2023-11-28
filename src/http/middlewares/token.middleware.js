const tokensService = require("../services/tokens.service");
const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  if (!req.user) {
    res.redirect(redirectPath.LOGIN_AUTH);
    return;
  }

  const tokenCookie = req.cookies.token;

  if (!tokenCookie) {
    res.redirect(redirectPath.LOGIN_AUTH);
    return;
  }

  const tokenValid = await tokensService.getLoginTokenByToken(tokenCookie);

  if (req.user && !tokenValid) {
    tokensService.removeLoginTokenByUserId(+req.user.id);

    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });

    res.redirect(redirectPath.LOGIN_AUTH);
    return;
  }

  if (!tokenValid) {
    res.redirect(redirectPath.LOGIN_AUTH);
    return;
  }

  next();
};
