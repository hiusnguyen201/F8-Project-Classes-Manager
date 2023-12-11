var Tokens = require("csrf");
const tokens = new Tokens();
const secret = tokens.secretSync();
const usersService = require("../services/users.service");

module.exports = {
  verify: async (req, res, next) => {
    const token = req.body.csrfToken;

    if (req.method !== "GET") {
      if (!tokens.verify(secret, token)) {
        if (req.user) {
          const user = await usersService.getUserById(req.user);
          const { Type } = user;
          return res.redirect(`/${Type.name}${req.url}`);
        } else {
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
