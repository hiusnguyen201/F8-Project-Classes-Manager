const { messageError } = require("../../constants/constants.message");
const tokenUtil = require("../../utils/token.util");
const models = require("../../models/index");
const LoginToken = models.Login_Token;

module.exports = {
  // Done
  createLoginToken: async function (userId) {
    try {
      const loginToken = await LoginToken.findOne({
        where: { user_id: +userId },
      });

      if (loginToken) {
        await loginToken.destroy();
      }

      const token = tokenUtil.createTokenByMd5();
      const newLoginToken = await LoginToken.create({
        token,
        user_id: userId,
      });

      if (newLoginToken) {
        return newLoginToken;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  getLoginTokenByToken: async (token) => {
    try {
      const loginToken = await LoginToken.findOne({
        where: {
          token: token ?? "",
        },
      });

      return loginToken;
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  // Done
  removeLoginTokenByToken: async (token) => {
    try {
      await LoginToken.destroy({
        where: {
          token,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  removeLoginTokenByUserId: async (userId) => {
    try {
      const statusDestroy = await LoginToken.destroy({
        where: {
          user_id: +userId,
        },
      });

      if (statusDestroy) {
        return;
      }
    } catch (err) {
      console.log(err);
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
