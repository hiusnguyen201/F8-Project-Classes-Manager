const {
  MESSAGE_ERROR,
  MESSAGE_INFO,
} = require("../../constants/message.constant");
const { REDIRECT_PATH } = require("../../constants/path.constant");
const { LIMIT_PAGE } = require("../../constants/setting.constant");
const { Op } = require("sequelize");

const { getDateNow } = require("../../utils/moment");
const { readFile } = require("../../utils/fileExcel");
const tokenUtil = require("../../utils/token");
const {
  getPassActiveAccountMailHtml,
  getResetPasswordMailHtml,
} = require("../../utils/string");
const sendMailUtil = require("../../utils/sendMail");

const models = require("../../models/index");
const TypeService = require("../services/type.service");
const typeService = new TypeService();

class UserService {
  constructor() {
    this.User = models.User;
    this.Type = models.Type;
  }

  async findById(id) {
    if (!id || !Number.isInteger(+id) || !(+id > 0)) {
      return null;
    }

    const user = await this.User.findByPk(id, {
      include: this.Type,
      attributes: {
        exclude: ["password"],
      },
      paranoid: false,
    });

    return user ? user : null;
  }

  async findByEmailWithPass(email) {
    const user = await this.User.findOne({
      where: { email },
      include: this.Type,
    });

    return user ? user : null;
  }

  async findByEmail(email) {
    const user = await this.User.findOne({
      where: { email },
      attributes: {
        exclude: ["password"],
      },
      paranoid: false,
    });

    return user ? user : null;
  }

  // get all user with pagination and search
  async findAllWithTypesAndSearchAndPaginate(queryString, types) {
    let { page = 1, limit = 10, keyword } = queryString;

    const filters = {};
    if (keyword) {
      filters[Op.or] = [
        {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          phone: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          address: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    const count = await this.User.count({
      where: filters,
      include: {
        model: this.Type,
        where: {
          name: {
            [Op.in]: Array.isArray(types) ? types : [types],
          },
        },
      },
    });

    limit = LIMIT_PAGE.includes(+limit) ? +limit : 10;
    const totalPage = Math.ceil(count / +limit);
    if (+page < 1 || +page > totalPage) {
      page = 1;
    }
    const offset = (+page - 1) * +limit;

    const users = await this.User.findAll({
      where: filters,
      include: {
        model: this.Type,
        where: {
          name: {
            [Op.in]: Array.isArray(types) ? types : [types],
          },
        },
      },
      offset,
      limit,
      attributes: {
        exclude: ["password"],
      },
    });

    return {
      meta: { page, offset, totalPage, limit, count },
      data: users,
    };
  }

  async findAllWithTypes(types) {
    const users = await this.User.findAll({
      include: {
        model: this.Type,
        where: {
          name: {
            [Op.in]: Array.isArray(types) ? types : [types],
          },
        },
        paranoid: false,
      },
      attributes: {
        exclude: ["password"],
      },
    });

    return users;
  }

  async create(data) {
    delete data.csrfToken;

    const passRandom = tokenUtil.generatePasswordRandom();
    const newUser = await this.User.create(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: !data.address ? null : data.address,
        typeId: data.typeId,
        password: tokenUtil.createHashByBcrypt(passRandom),
      },
      {
        attributes: {
          exclude: ["password"],
        },
      }
    );

    if (newUser) {
      const passActiveAccountHtml = getPassActiveAccountMailHtml(
        data.email,
        passRandom
      );

      sendMailUtil(
        data.email,
        MESSAGE_INFO.PASSWORD_ACTIVE_ACCOUNT,
        passActiveAccountHtml
      );

      return newUser;
    }
  }

  async update(data, id) {
    const user = await this.findById(id);

    if (!user) {
      throw new Error(MESSAGE_ERROR.USER.USER_NOT_FOUND);
    }

    const status = await user.update({
      ...data,
      updatedAt: getDateNow(),
    });

    return status;
  }

  async removeUsers(listId) {
    const users = await this.User.findAll({
      where: {
        id: {
          [Op.in]: listId,
        },
      },
    });

    if (users?.length !== listId.length) {
      throw new Error(MESSAGE_ERROR.USER.USER_NOT_FOUND);
    }

    const status = await this.User.destroy({
      where: {
        id: {
          [Op.in]: listId,
        },
      },
    });

    return status;
  }

  async changePassword(userId, password) {
    const hash = tokenUtil.createHashByBcrypt(password);
    const status = await this.update(
      {
        password: hash,
        firstLogin: 1,
        updatedAt: getDateNow(),
      },
      userId
    );

    return status;
  }

  async sendResetPassLink(email) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error(MESSAGE_ERROR.USER.USER_NOT_FOUND);
    }

    const token = tokenUtil.createTokenByJwt(user.id);

    const resetPassHtml = getResetPasswordMailHtml(
      user.name,
      REDIRECT_PATH.AUTH.EMAIL_PASS_RESET,
      token
    );

    if (!resetPassHtml) {
      throw new Error(MESSAGE_ERROR.OTHER.READ_MAIL_HTML);
    }

    sendMailUtil(user.email, MESSAGE_INFO.RESET_PASS_TITLE, resetPassHtml);

    return true;
  }

  async importUsers(typeName, fileInfo, userFields) {
    const [dataArr, message] = await readFile(fileInfo, userFields);

    if (!dataArr) {
      throw new Error(message);
    }

    const types = await typeService.findAllByTypes();

    await Promise.all(
      dataArr.map(async (data) => {
        const obj = types.find((item) => item.name === typeName ?? data.type);
        const user = await this.findByEmail(data.email);
        if (!user) {
          return await this.create(
            data.name,
            data.email,
            data.phone,
            data.address,
            +obj.id
          );
        }
      })
    );

    return true;
  }
}

module.exports = UserService;
