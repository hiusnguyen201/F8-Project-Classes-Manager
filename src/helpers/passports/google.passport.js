const GoogleStrategy = require("passport-google-oauth2");
const socialsService = require("../../http/services/socials.service");
const tokensService = require("../../http/services/tokens.service");
const usersService = require("../../http/services/users.service");
const { messageError } = require("../../constants/constants.message");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    scope: ["profile", "email"],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const token = req.cookies.token;

    const tokenValid = await tokensService.getLoginTokenByToken(token);
    if (!tokenValid) {
      // Login Page
      const userSocial = await socialsService.getUserSocialByProvider(
        profile.provider,
        profile.id
      );

      if (!userSocial) {
        return done(null, false, { message: messageError.LOGIN_GOOGLE_FAILED });
      }

      return done(null, userSocial.User);
    } else {
      // Social Link page
      const user = await usersService.getUserByEmail(profile.email);
      if (!user) {
        return done(null, false, {
          message: messageError.INVALID_ACCOUNT_GOOGLE,
        });
      }

      const [newUserSocial, created] =
        await socialsService.findOrCreateUserSocialProvider(
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
