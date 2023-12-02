var Tokens = require("csrf");
const tokens = new Tokens();
const secret = tokens.secretSync();
const { messageError } = require("../../constants/constants.message");

module.exports = {
  verify: (req, res, next) => {
    const token = req.body.csrfToken;

    if (req.method !== "GET") {
      if (!tokens.verify(secret, token)) {
        const { Type } = req.user;
        req.flash("error", messageError.INVALID_TOKEN_CSRF);
        return res.redirect(`/${Type.name}${req.url}`);
      }
    }

    next();
  },

  createToken: () => {
    return tokens.create(secret);
  },
};
