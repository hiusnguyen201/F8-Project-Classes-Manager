const { redirectPath } = require("../../constants/constants.path");

module.exports = (req, res, next) => {
  const userId = req.user;
  if (!userId) {
    return res.redirect(redirectPath.LOGIN_AUTH);
  }
  next();
};
//