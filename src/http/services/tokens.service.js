const { messageError } = require("../../constants/constants.message");
const tokenUtil = require("../../utils/token.util");
const momentUtil = require("../../utils/moment.util");
const otpsService = require("../services/otps.service");
const models = require("../../models/index");
const LoginToken = models.Login_Token;

module.exports = {
  createLoginToken: async function (res, userId) {
    const loginToken = await this.getLoginTokenByUserId(+userId);
    if (loginToken) {
      this.removeLoginTokenByObj(loginToken);
      res.clearCookie("token");
    }

    const token = tokenUtil.createTokenByMd5();
    try {
      const loginToken = await LoginToken.create({
        token,
        user_id: userId,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });

      if (loginToken) {
        res.cookie("token", loginToken.token);
        return loginToken;
      }
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  getLoginTokenByUserId: async (userId) => {
    try {
      const loginToken = await LoginToken.findOne({
        where: {
          user_id: userId,
        },
      });

      return loginToken;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  getLoginTokenByToken: async (token) => {
    try {
      const loginToken = await LoginToken.findOne({
        where: {
          token: token ?? "",
        },
      });

      return loginToken;
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },

  removeLoginTokenByObj: async (loginToken) => {
    try {
      const statusDestroy = await loginToken.destroy();
      if (statusDestroy) {
        return;
      }
    } catch (error) {
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
    } catch (error) {
      throw new Error(messageError.SERVER_ERROR);
    }
  },
};
