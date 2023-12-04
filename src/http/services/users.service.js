const { messageError } = require("../../constants/constants.message");
const tokensUtil = require("../../utils/token.util");
const models = require("../../models/index");
const User = models.User;

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (user) {
        return user;
      }
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  getUserById: async (userId) => {
    try {
      const user = await User.findByPk(+userId);

      if (user) {
        return user;
      }
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  updatePassword: async (userId, password) => {
    try {
      const hash = tokensUtil.createHashByBcrypt(password);

      const statusUpdated = await User.update(
        { password: hash },
        { where: { id: +userId } }
      );

      if (statusUpdated) {
        return statusUpdated;
      }
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
