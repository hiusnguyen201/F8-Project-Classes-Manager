const moment = require("moment");

module.exports = {
  getTimeNow: () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },
};
