const { redirectPath } = require("../../constants/constants.path");

module.exports = (req, res, next) => {
  const url = req.path;
  if (!req.user) {
    res.clearCookie("token");
    return res.redirect(redirectPath.LOGIN_AUTH);
  }

  if (req.user.type_id === 1) {
    if (!url.includes(redirectPath.HOME_ADMIN)) {
      return res.redirect(redirectPath.HOME_ADMIN);
    }
  } else if (req.user.type_id === 2) {
    if (url.includes(redirectPath.HOME_TEACHER)) {
      return res.redirect(redirectPath.HOME_TEACHER);
    }
  } else if (req.user.type_id === 3) {
    if (url.includes(redirectPath.HOME_STUDENT)) {
      return res.redirect(redirectPath.HOME_STUDENT);
    }
  }

  next();
};
