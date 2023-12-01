const moment = require("moment-timezone");

module.exports = {
  getDateNow: () => {
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

  comparisonDate: (date1, date2) => {
    return moment().diff(date1, date2);
  },
};
