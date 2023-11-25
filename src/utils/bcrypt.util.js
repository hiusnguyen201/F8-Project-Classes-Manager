const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  makeHash: (value) => {
    return bcrypt.hashSync(value, saltRounds);
  },

  compareHash: (value, hash) => {
    return bcrypt.compareSync(value, hash);
  },
};
