const { redirectPath } = require("../../constants/constants.path");

module.exports = (req, res, next) => {
  if (!req.user) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }
  next();
};
//
