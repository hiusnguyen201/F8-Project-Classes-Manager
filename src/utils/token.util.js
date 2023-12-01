const { authenticator } = require("otplib");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const momentUtil = require("./moment.util");

module.exports = {
  createTokenByMd5: () => {
    return md5(momentUtil.getTimeNowMiliseconds() + Math.random());
  },

  createOtpTokenByOtplib: () => {
    return authenticator.generate(momentUtil.getDateNow() + Math.random());
  },

  createHashByBcrypt: (value) => {
    return bcrypt.hashSync(value, saltRounds);
  },

  compareHashByBcrypt: (value, hash) => {
    return bcrypt.compareSync(value, hash);
  },
};
