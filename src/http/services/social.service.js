const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} = require("../../constants/message.constant");
const models = require("../../models/index");
const UserSocial = models.User_Social;
const User = models.User;
const Type = models.Type;

module.exports = {
  getUserSocial: async (filters) => {
    try {
      const userSocial = await UserSocial.findOne({
        where: filters,
        include: {
          model: User,
          attributes: {
            exclude: ["password"],
          },
          include: Type,
        },
      });

      if (userSocial) {
        return [userSocial, null];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.SOCIAL.FIND_SOCIAL_FAILED];
  },

  createUserSocial: async (provider, provider_id, userId) => {
    try {
      const [userSocial] = await UserSocial.create({
        provider,
        provider_id,
        userId,
      });

      if (userSocial) {
        return [userSocial, null];
      } else {
      }
    } catch (err) {
      console.log(err);
    }
    return [null, MESSAGE_ERROR.SOCIAL.CREATE_SOCIAL_FAILED];
  },

  // Setting Page
  removeUserSocial: async (id, provider, userId) => {
    try {
      const statusRemove = await UserSocial.destroy({
        where: {
          id: +id,
          provider,
          userId: +userId,
        },
      });

      if (statusRemove) {
        return [true, MESSAGE_SUCCESS.SOCIAL.REMOVE_ACCOUNT_SOCIAL_SUCCESS];
      }
    } catch (err) {
      console.log(err);
    }
    return [false, MESSAGE_ERROR.SOCIAL.REMOVE_ACCOUNT_SOCIAL_FAILED];
  },
};
