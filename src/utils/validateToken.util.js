const tokensService = require("../http/services/tokens.service");

module.exports = async (req, res, tokenCookie) => {
  const tokenValid = await tokensService.getLoginTokenByToken(tokenCookie);
  if (!tokenValid) {
    if (req.user) {
      res.clearCookie("token");
    }

    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });
  }
  return tokenValid;
};
