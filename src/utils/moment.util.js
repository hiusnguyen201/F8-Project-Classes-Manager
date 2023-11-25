const moment = require("moment");

module.exports = {
  getTimeUTC: () => {
    return moment().format("YYYY-MM-DD HH:mm:ss");
  },
};
