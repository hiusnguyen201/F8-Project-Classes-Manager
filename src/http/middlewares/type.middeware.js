const { redirectPath } = require("../../constants/constants.path");

module.exports = async (req, res, next) => {
  const url = req.path;
  const user = req.user;
  if (user.type_id === 1) {
    if (!url.includes(redirectPath.HOME_ADMIN)) {
      return res.redirect(redirectPath.HOME_ADMIN);
    }
  } else if (user.type_id === 2) {
    if (!url.includes(redirectPath.HOME_TEACHER)) {
      return res.redirect(redirectPath.HOME_TEACHER);
    }
  } else if (user.type_id === 3) {
    if (!url.includes(redirectPath.HOME_STUDENT)) {
      return res.redirect(redirectPath.HOME_STUDENT);
    }
  }

  next();
};
