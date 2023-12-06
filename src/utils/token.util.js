const { authenticator } = require("otplib");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sha1 = require("sha1");
const saltRounds = 10;
const momentUtil = require("./moment.util");

module.exports = {
  createTokenByMd5: () => {
    return md5(momentUtil.getTimeNowMiliseconds() + Math.random());
  },

  createTokenBySha1: () => {
    return sha1(momentUtil.getTimeNowMiliseconds() + Math.random());
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

  createTokenByJwt: (data) => {
    return jwt.sign(
      {
        exp:
          Math.floor(momentUtil.getTimeNowMiliseconds() / 1000) +
          60 * process.env.JWT_EXPIRE,
        data: data.toString(),
      },
      process.env.JWT_SECRET
    );
  },

  verifyTokenByJwt: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        const { data } = decoded;
        return data;
      }
    } catch (err) {
      return null;
    }
  },
};
