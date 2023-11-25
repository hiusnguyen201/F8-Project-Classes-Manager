const {
  renderPath,
  redirectPath,
} = require("../../../constants/constants.path");
const { messageError } = require("../../../constants/constants.message");

module.exports = {
  login: (req, res) => {
    const errors = req.flash("error");

    if (errors[0] === "Missing credentials") {
      errors[0] = messageError.MISSING_CREDENTIALS;
    }

    res.render(renderPath.LOGIN_AUTH, {
      layout: "layouts/auth",
      title: `Login - ${process.env.APP_NAME} Accounts`,
      errors,
    });
  },

  handleLogin: (req, res) => {
    const { Type: userType } = req.user;
    if (userType.name === "student") {
      res.redirect(redirectPath.HOME_STUDENT);
    } else if (userType.name === "teacher") {
      res.redirect(redirectPath.HOME_TEACHER);
    } else if (userType.name === "admin") {
      res.redirect(redirectPath.HOME_ADMIN);
    }
  },
};
<<<<<<< HEAD
//
=======
//
>>>>>>> feature/16-code-feature-login
