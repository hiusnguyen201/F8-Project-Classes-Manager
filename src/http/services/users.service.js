const {
  messageError,
  messageInfo,
  messageSuccess,
} = require("../../constants/constants.message");
const { redirectPath } = require("../../constants/constants.path");
const tokensUtil = require("../../utils/token.util");
const stringUtil = require("../../utils/string.util");
const sendMailUtil = require("../../utils/sendMail.util");
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
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  getUserById: async (userId) => {
    try {
      const user = await User.findByPk(+userId);

      if (user) {
        return user;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  updatePassword: async (userId, password) => {
    try {
      const hash = tokensUtil.createHashByBcrypt(password);
      const statusUpdated = await User.update(
        { password: hash, first_login: 1 },
        { where: { id: +userId } }
      );

      if (statusUpdated) {
        return statusUpdated;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  updateProfile: async (userId, name, email, phone, address) => {
    try {
      const statusUpdated = await User.update(
        {
          name,
          email,
          phone,
          address,
        },
        {
          where: { id: +userId },
        }
      );

      if (statusUpdated) {
        return statusUpdated;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  sendResetPassLink: async (email) => {
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return [false, messageError.EMAIL_NOT_EXIST];
      }

      const token = tokensUtil.createTokenByJwt(user.id);

      const resetPassHtml = stringUtil.getResetPasswordMailHtml(
        user.name,
        redirectPath.EMAIL_PASS_RESET,
        token
      );

      sendMailUtil(user.email, messageInfo.RESET_PASS_TITLE, resetPassHtml);

      return [true, messageSuccess.SENDED_RESET_PASS];
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
//
