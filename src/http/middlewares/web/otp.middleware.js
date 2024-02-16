const { REDIRECT_PATH } = require("../../../constants/path.constant");

module.exports = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect(REDIRECT_PATH.LOGIN_AUTH);
  }

  next();
};
