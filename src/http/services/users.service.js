const { messageError } = require("../../constants/constants.message");
const tokenUtil = require("../../utils/token.util");
const models = require("../../models/index");
const User = models.User;
const Type = models.Type;
const LoginToken = models.Login_Token;

module.exports = {
  getUserByEmail: async (email) => {
    if (!email) {
      throw new Error(messageError.EMPTY_FIELD);
    }

    const user = await User.findOne({
      where: { email },
      include: {
        model: Type,
      },
    });

    return user;
  },

  createLoginToken: async (userId) => {
    if (!userId) {
      throw new Error(messageError.EMPTY_FIELD);
    }

    const token = tokenUtil.create;

    const status = await LoginToken.create({
      token,
      user_id: userId,
    });

    return status;
  },
};