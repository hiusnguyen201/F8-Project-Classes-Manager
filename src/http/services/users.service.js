const { messageError } = require("../../constants/constants.message");
const models = require("../../models/index");
const User = models.User;
const Type = models.Type;

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

    if (!user) {
      throw new Error(messageError.SERVER_ERROR);
    }

    return user;
  },
};
//