const { messageError } = require("../../constants/constants.message");
const models = require("../../models/index");
const User = models.User;
const UserSocial = models.User_Social;

module.exports = {
  // Done
  getUserSocialByProvider: async (provider, provider_id) => {
    try {
      const userSocial = await UserSocial.findOne({
        where: {
          provider,
          provider_id,
        },
      });

      return userSocial;
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  getUserSocialByUserIdAndProvider: async (userId, provider) => {
    try {
      const userSocial = await UserSocial.findOne({
        where: {
          user_id: +userId,
          provider,
        },
      });
      return userSocial;
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  findOrCreateUserSocialProvider: async (provider, provider_id, user_id) => {
    try {
      const [userSocial, created] = await UserSocial.findOrCreate({
        where: {
          provider,
          provider_id,
          user_id,
        },
        default: {
          provider,
          provider_id,
          user_id,
        },
      });

      if (userSocial) {
        return [userSocial, created];
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  removeUserSocial: async (id, provider, userId) => {
    try {
      const userSocial = await UserSocial.findOne({
        where: {
          id: +id,
          provider,
          user_id: +userId,
        },
      });

      if (!userSocial) {
        return [false, messageError.SOMETHING_WRONG];
      }

      const statusRemove = await userSocial.destroy();
      if (statusRemove) {
        return [true, null];
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
