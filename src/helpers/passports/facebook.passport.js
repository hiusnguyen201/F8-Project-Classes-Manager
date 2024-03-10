const FacebookStrategy = require("passport-facebook").Strategy;
const { MESSAGE_ERROR } = require("../../constants/message.constant");
const SocialService = require("../../http/services/social.service");
const userSocialService = new SocialService();
const TokenService = require("../../http/services/token.service");
const tokenService = new TokenService();

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    const userSocial = await userSocialService.findByProviderId(
      profile.id,
      profile.provider
    );

    const loginToken = await tokenService.findByToken(req.cookies?.token);
    if (!loginToken) {
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
