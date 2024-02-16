const tokenUtil = require("../../utils/token");
const { MESSAGE_ERROR } = require("../../constants/message.constant");
const models = require("../../models/index");
const LoginToken = models.Login_Token;

module.exports = {
  createLoginToken: async function (userId) {
    try {
      const loginToken = await LoginToken.findOne({
        where: { userId: +userId },
      });

      if (loginToken) {
        await loginToken.destroy();
      }

      const token = tokenUtil.createTokenByMd5();
      const newLoginToken = await LoginToken.create({
        token,
        userId: userId,
      });

      if (newLoginToken) {
        return [newLoginToken, null];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.TOKEN.CREATE_TOKEN_FAILED];
  },

  getLoginToken: async (filters) => {
    try {
      const loginToken = await LoginToken.findOne({
        where: filters,
      });

      if (loginToken) {
        return [loginToken, null];
      } else {
        return [null, MESSAGE_ERROR.TOKEN.LOGIN_TOKEN_NOT_FOUND];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.TOKEN.FIND_TOKEN_FAILED];
  },

  removeLoginToken: async (filters) => {
    try {
      const statusDestroy = await LoginToken.destroy({
        where: filters,
      });

      if (statusDestroy) {
        return [true, null];
      }
    } catch (err) {
      console.log(err);
    }
    return [false, MESSAGE_ERROR.TOKEN.REMOVE_TOKEN_FAILED];
  },
};
