const validateTokenUtil = require("../../utils/validateToken.util");

module.exports = async (req, res, next) => {
  const tokenCookie = req.cookies.token;
  if (tokenCookie) {
    const tokenValid = await validateTokenUtil(req, res, tokenCookie);
    if (tokenValid) {
      next();
    } else {
      return res.redirect(redirectPath.LOGIN_AUTH);
    }
  } else {
    next();
  }
};
