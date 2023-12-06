var Tokens = require("csrf");
const tokens = new Tokens();
const secret = tokens.secretSync();
const usersService = require("../services/users.service");
const { messageError } = require("../../constants/constants.message");

module.exports = {
  verify: async (req, res, next) => {
    const token = req.body.csrfToken;

    if (req.method !== "GET") {
      if (!tokens.verify(secret, token)) {
        if (req.user) {
          const user = await usersService.getUserById(req.user);
          const { Type } = user;
          req.flash("error", messageError.INVALID_TOKEN_CSRF);
          return res.redirect(`/${Type.name}${req.url}`);
        } else {
          req.flash("error", messageError.INVALID_TOKEN_CSRF);
          return res.redirect(`/${req.url}`);
        }
      }
    }

    next();
  },

  createToken: () => {
    return tokens.create(secret);
  },
};
