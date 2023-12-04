const FacebookStrategy = require("passport-facebook").Strategy;
const socialsService = require("../../http/services/socials.service");
const { messageError } = require("../../constants/constants.message");

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const userSocial = await socialsService.getUserSocialByProvider(
      profile.provider,
      profile.id
    );

    if (!req.isAuthenticated()) {
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
