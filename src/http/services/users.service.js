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
};
//