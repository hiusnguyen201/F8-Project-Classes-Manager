const { Op } = require("sequelize");
const {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} = require("../../constants/message.constant");
const models = require("../../models/index");

class SocialService {
  constructor() {
    this.UserSocial = models.User_Social;
    this.User = models.User;
  }

  async findAll(userId, providers) {
    const userSocials = await this.UserSocial.findAll({
      where: {
        userId,
        provider: {
          [Op.in]: providers,
        },
      },
    });

    return userSocials;
  }

  async findByProviderId(providerId, provider) {
    const userSocial = await this.UserSocial.findOne({
      where: {
        provider,
        providerId,
      },
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
    });

    return userSocial ? userSocial : null;
  }

  async findByUserIdAndProvider(userId, provider) {
    const userSocial = await this.UserSocial.findOne({
      where: {
        userId,
        provider,
      },
      include: {
        model: this.User,
        attributes: {
          exclude: ["password"],
        },
      },
    });

    return userSocial ? userSocial : null;
  }

  async create(providerId, provider, userId) {
    const existUserSocial = await this.findByProviderId(providerId, provider);

    if (existUserSocial) {
      throw new Error(MESSAGE_ERROR.SOCIAL.INVALID_LINK_ACCOUNT);
    }

    const userSocial = await this.UserSocial.create({
      provider,
      providerId,
      userId,
    });

    return userSocial ? userSocial : null;
  }

  async delete(provider, userId) {
    const userSocial = await this.findByUserIdAndProvider(userId, provider);

    if (!userSocial) {
      throw new Error(MESSAGE_ERROR.SOCIAL.SOCIAL_NOT_FOUND);
    }

    const status = await userSocial.destroy();

    return status;
  }
}

module.exports = SocialService;
