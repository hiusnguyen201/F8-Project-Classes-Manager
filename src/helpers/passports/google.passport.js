const GoogleStrategy = require("passport-google-oauth2");
const socialsService = require("../../http/services/socials.service");
const tokensService = require("../../http/services/tokens.service");
const { messageError } = require("../../constants/constants.message");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    scope: ["profile"],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const token = req.cookies.token;

    const userSocial = await socialsService.getUserSocialByProvider(
      profile.provider,
      profile.id
    );

    const tokenValid = await tokensService.getLoginTokenByToken(token);
    if (!tokenValid) {
      // Login Page

      if (!userSocial) {
        return done(null, false, { message: messageError.ACCOUNT_NOT_LINKED });
      }

      return done(null, userSocial.user_id);
    } else {
      // Social Link page
      if (userSocial) {
        return done(null, false, {
          message: messageError.INVALID_LINK_ACCOUNT,
        });
      }

      const [newUserSocial, created] =
        await socialsService.findOrCreateUserSocialProvider(
          profile.provider,
          profile.id,
          req.user.id
        );

      if (newUserSocial) {
        return done(null, newUserSocial.user_id);
      }
    }
  }
);
