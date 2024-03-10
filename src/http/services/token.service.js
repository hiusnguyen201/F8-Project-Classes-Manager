const tokenUtil = require("../../utils/token");
const { MESSAGE_ERROR } = require("../../constants/message.constant");
const models = require("../../models/index");

class TokenService {
  constructor() {
    this.LoginToken = models.Login_Token;
    this.User = models.User;
  }

  async findByToken(token) {
    const loginToken = await this.LoginToken.findOne({
      where: { token },
      include: this.User,
    });

    return loginToken ? loginToken : null;
  }

  async findByUserId(userId) {
    const loginToken = await this.LoginToken.findOne({
      where: { userId },
    });

    return loginToken ? loginToken : null;
  }

  async create(userId) {
    const loginToken = await this.findByUserId(userId);

    if (loginToken) {
      await loginToken.destroy();
    }

    const token = tokenUtil.createTokenByMd5();
    const newLoginToken = await this.LoginToken.create({
      token,
      userId: userId,
    });

    return newLoginToken;
  }

  async remove(token) {
    const loginToken = await this.findByToken(token);

    if (!loginToken) {
      throw new Error(MESSAGE_ERROR.TOKEN.LOGIN_TOKEN_NOT_FOUND);
    }

    const status = await loginToken.destroy();
    return status;
  }
}

module.exports = TokenService;
