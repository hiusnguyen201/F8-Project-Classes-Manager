const md5 = require("md5");
const momentUtil = require("../utils/moment.util");

module.exports = {
  createTokenByMd5: () => {
    return md5(momentUtil.getTimeNowMiliseconds() + Math.random());
  },
};
