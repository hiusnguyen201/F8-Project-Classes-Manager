const { messageError } = require("../../constants/constants.message");
const models = require("../../models/index");
const User = models.User;
const Type = models.Type;

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const user = await User.findOne({
        where: { email },
      });

      return user;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
