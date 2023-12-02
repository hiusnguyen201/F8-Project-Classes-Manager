const { redirectPath } = require("../../constants/constants.path");

module.exports = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }
  next();
};
