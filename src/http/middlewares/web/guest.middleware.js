const { REDIRECT_PATH } = require("../../../constants/path.constant");
const tokenService = require("../../services/token.service");

module.exports = async (req, res, next) => {
  const tokenCookie = req.cookies?.token;

  if (!req.isAuthenticated()) {
    res.clearCookie("token");
  }

  if (tokenCookie && req.isAuthenticated()) {
    const [tokenValid] = await tokenService.getLoginToken({
      token: tokenCookie,
    });

    if (!tokenValid) {
      res.clearCookie("token");
      return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
    }

    const { Type } = req.user;
    if (Type.name === "admin") {
      return res.redirect(REDIRECT_PATH.HOME_ADMIN);
    } else if (Type.name === "teacher") {
      return res.redirect(REDIRECT_PATH.HOME_TEACHER);
    } else if (Type.name === "student") {
      return res.redirect(REDIRECT_PATH.HOME_STUDENT);
    }
  }

  next();
};
