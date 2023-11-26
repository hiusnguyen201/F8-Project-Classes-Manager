const { authenticator } = require("otplib");
const momentUtil = require("../utils/moment.util");

module.exports = {
  createOtpToken: () => {
    return authenticator.generate(momentUtil.getTimeNow() + Math.random());
  },
};
