const { messageError } = require("../../constants/constants.message");
const tokenUtil = require("../../utils/token.util");
const models = require("../../models/index");
const LoginToken = models.Login_Token;
const User = models.User;

module.exports = {
  createLoginToken: async (userId) => {
    const token = tokenUtil.createTokenByMd5();

    const loginToken = await LoginToken.create({
      token,
      user_id: userId,
    });

    if (!loginToken) {
      throw new Error(messageError.SERVER_ERROR);
    }

    return loginToken;
  },

  getLoginTokenById: async (userId) => {
    const loginToken = await LoginToken.findByPk(userId);
    return loginToken;
  },

  getLoginTokenByToken: async (token) => {
    const loginToken = await LoginToken.findOne({
      token: token ?? "",
    });

    return loginToken;
  },

  removeLoginTokenByObj: async (loginToken) => {
    const status = await loginToken.destroy();
    if (!status) {
      throw new Error(messageError.SERVER_ERROR);
    }
    return;
  },

  removeLoginTokenByUserId: async (userId) => {
    const status = await LoginToken.destroy({
      where: {
        user_id: userId,
      },
    });

    if (!status) {
      throw new Error(messageError.SERVER_ERROR);
    }
    return;
  },
};
