const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { MESSAGE_ERROR } = require("../../constants/message.constant");
const SocialService = require("../../http/services/social.service");
const SocialServiceInstance = new SocialService();
const TokenService = require("../../http/services/token.service");
const tokenService = new TokenService();

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    scope: ["profile"],
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const userSocial = await SocialServiceInstance.findByProviderId(
      profile.id,
      profile.provider
    );

    const loginToken = await tokenService.findByToken(req.cookies?.token);
    if (!req.cookies.token) {
      // Login Page
      if (!userSocial) {
        return done(null, false, {
          message: MESSAGE_ERROR.SOCIAL.ACCOUNT_NOT_LINKED,
        });
      }

      return done(null, userSocial.User);
    }

    req.cookies.profile = {
      provider: profile.provider,
      providerId: profile.id,
    };

    return done(null, loginToken.User);
  }
);
