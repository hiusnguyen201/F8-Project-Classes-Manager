const LocalStrategy = require("passport-local").Strategy;
const { validationResult } = require("express-validator");
const UserService = require("../../http/services/user.service");
const userService = new UserService();
const tokenUtil = require("../../utils/token");
const { MESSAGE_ERROR } = require("../../constants/message.constant");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    const { errors } = validationResult(req);
    if (errors?.length) {
      if (errors[0].msg !== "Invalid value") {
        return done(null, false, {
          message: errors[0].msg,
        });
      }
    }

    try {
      const user = await userService.findByEmailWithPass(email);
      if (!tokenUtil.compareHashByBcrypt(password, user.password)) {
        return done(null, false, {
          message: MESSAGE_ERROR.USER.INVALID_ACCOUNT,
        });
      }

      delete user.dataValues.password;
      delete user._previousDataValues.password;

      done(null, user);
    } catch (err) {
      console.log(err);
      return done(null, false, { message: MESSAGE_ERROR.USER.INVALID_ACCOUNT });
    }
  }
);
