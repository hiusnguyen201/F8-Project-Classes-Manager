const tokensService = require("../services/tokens.service.js");
const { redirectPath } = require("../../constants/constants.path.js");

module.exports = async (req, res, next) => {
  const tokenCookie = req.cookies.token;

  if (!tokenCookie) {
    next();
  } else {
    const loginToken = await tokensService.getLoginTokenByToken(tokenCookie);

    if (!loginToken) {
      return res.redirect(redirectPath.LOGIN_AUTH);
    }

    const { User } = loginToken;
    const { Type } = User;
    const url = req.url;

    if (Type.name === "student") {
      if (url.includes("/")) {
        next();
      } else {
        return res.redirect(redirectPath.HOME_STUDENT);
      }
    } else if (Type.name === "teacher") {
      if (url.includes("/teacher")) {
        next();
      } else {
        return res.redirect(redirectPath.HOME_TEACHER);
      }
    } else if (Type.name === "admin") {
      if (url.includes("/admin")) {
        next();
      } else {
        return res.redirect(redirectPath.HOME_ADMIN);
      }
    }
  }
};
