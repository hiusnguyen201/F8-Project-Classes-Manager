const GitHubStrategy = require("passport-github2").Strategy;
const socialsService = require("../../http/services/socials.service");
const { messageError } = require("../../constants/constants.message");

module.exports = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    passReqToCallback: true,
    scope: ["profile"],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const userSocial = await socialsService.getUserSocialByProvider(
      profile.provider,
      profile.id
    );

    if (!req.cookies.token) {
      // Login Page
      if (!userSocial) {
        return done(null, false, { message: messageError.ACCOUNT_NOT_LINKED });
      }

      return done(null, userSocial.user_id);
    } else {
      if (userSocial) {
        return done(null, false, {
          message: messageError.INVALID_LINK_ACCOUNT,
        });
      }
      // Social Link page
      const [newUserSocial] =
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
