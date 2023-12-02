const tokensService = require("../services/tokens.service");
const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    res.clearCookie("token");
  }

  const tokenCookie = req.cookies.token;
  const tokenValid = await tokensService.getLoginTokenByToken(tokenCookie);
  if (tokenValid) {
    return res.redirect(redirectPath.HOME_STUDENT);
  }

  res.clearCookie("token");
  next();
};
