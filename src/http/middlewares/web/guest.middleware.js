const { REDIRECT_PATH } = require("../../../constants/path.constant");
const TokenService = require("../../services/token.service");
const tokenService = new TokenService();
const classifyRedirect = require("../../../utils/classifyRedirect");

module.exports = async (req, res, next) => {
  const tokenCookie = req.cookies?.token;

  if (!tokenCookie || req.session.firstLogin) {
    return next();
  }

  const tokenValid = await tokenService.findByToken(tokenCookie);
  if (!tokenValid) {
    res.clearCookie("token");
    return res.redirect(REDIRECT_PATH.AUTH.LOGIN);
  }

  return res.redirect(
    classifyRedirect(req.user.Type.name, [
      REDIRECT_PATH.ADMIN.HOME_ADMIN,
      REDIRECT_PATH.HOME_TEACHER,
      REDIRECT_PATH.HOME_STUDENT,
    ])
  );
};
