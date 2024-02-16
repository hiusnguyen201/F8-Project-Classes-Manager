var Tokens = require("csrf");
const tokens = new Tokens();
const secret = tokens.secretSync();
const { MESSAGE_ERROR } = require("../../../constants/message.constant");

module.exports = {
  verify: async (req, res, next) => {
    const token = req.body.csrfToken;

    if (req.method !== "GET") {
      if (!tokens.verify(secret, token)) {
        req.flash("error", MESSAGE_ERROR.OTHER.INVALID_TOKEN_CSRF);
        return res.redirect(req.originalUrl);
      }
    }

    next();
  },

  createToken: () => {
    return tokens.create(secret);
  },
};
