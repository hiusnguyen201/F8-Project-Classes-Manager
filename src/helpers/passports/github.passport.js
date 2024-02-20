const GitHubStrategy = require("passport-github2").Strategy;
const socialService = require("../../http/services/social.service");
const { MESSAGE_ERROR } = require("../../constants/message.constant");

module.exports = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    passReqToCallback: true,
    scope: ["profile"],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const [userSocial] = await socialService.getUserSocial({
      provider: profile.provider,
      provider_id: profile.id,
    });

    if (!req.cookies.token) {
      // Login Page
      if (!userSocial) {
        return done(null, false, {
          message: MESSAGE_ERROR.SOCIAL.ACCOUNT_NOT_LINKED,
        });
      }

      const { User } = userSocial;
      return done(null, User);
    } else {
      if (userSocial) {
        return done(null, false, {
          message: MESSAGE_ERROR.SOCIAL.INVALID_LINK_ACCOUNT,
        });
      }
      // Social Link page
      const user = req.user;
      const [newUserSocial] = await socialService.createUserSocial(
        profile.provider,
        profile.id,
        +user.id
      );

      if (newUserSocial) {
        return done(null, user);
      }
    }
  }
);
