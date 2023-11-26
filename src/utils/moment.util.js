const moment = require("moment");

module.exports = {
  getTimeNow: () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },

  createOtpExpire: () => {
    const range = +process.env.OTP_EXPIRE_MINUTES * 60000;
    return moment(moment().valueOf() + range).format("YYYY-MM-DD HH:mm:ss");
  },
};
