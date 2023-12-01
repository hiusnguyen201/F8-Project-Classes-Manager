const LocalStrategy = require("passport-local").Strategy;

const usersService = require("../../http/services/users.service");
const tokenUtil = require("../../utils/token.util");
const { messageError } = require("../../constants/constants.message");

module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    let user = await usersService.getUserByEmail(email);

    if (!user) {
      return done(null, false, {
        message: messageError.INVALID_ACCOUNT,
      });
    }

    if (!tokenUtil.compareHashByBcrypt(password, user.password)) {
      return done(null, false, {
        message: messageError.INVALID_ACCOUNT,
      });
    }

    delete user.dataValues.password;
    delete user._previousDataValues.password;

    done(null, user);
  }
);
