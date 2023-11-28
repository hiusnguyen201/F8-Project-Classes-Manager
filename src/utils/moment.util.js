const moment = require("moment");

module.exports = {
  getTimeNow: () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },

  createOtpExpire: function () {
    const range = +process.env.OTP_EXPIRE_MINUTES * 60000;
    return moment(this.getTimeNowMiliseconds() + range).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  },

  getTimeNowMiliseconds: () => {
    return moment().valueOf();
  },
};
