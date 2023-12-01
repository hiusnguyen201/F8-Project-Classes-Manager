const {
  messageError,
  messageInfo,
} = require("../../constants/constants.message");
const models = require("../../models/index");
const User = models.User;
const UserSocial = models.User_Social;

module.exports = {
  getUserSocialByProvider: async (provider, provider_id) => {
    try {
      const userSocial = await UserSocial.findOne({
        where: {
          provider,
          provider_id,
        },
        include: User,
      });

      return userSocial;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  getUserSocialByUserId: async (userId) => {
    try {
      const userSocial = await UserSocial.findOne({
        where: {
          user_id: +userId,
        },
      });
      return userSocial;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  findOrCreateUserSocialProvider: async (provider, provider_id, user_id) => {
    try {
      const [userSocial, created] = await UserSocial.findOrCreate({
        where: {
          provider,
          provider_id,
          user_id,
        },
        include: User,
        default: {
          provider,
          provider_id,
          user_id,
        },
      });

      if (userSocial) {
        return [userSocial, created];
      }
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
