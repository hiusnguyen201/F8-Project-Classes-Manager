const { Op } = require("sequelize");
const {
  MESSAGE_ERROR,
  MESSAGE_INFO,
  MESSAGE_SUCCESS,
} = require("../../constants/message.constant");
const { REDIRECT_PATH } = require("../../constants/path.constant");

const momentUtil = require("../../utils/moment");
const fileExcel = require("../../utils/fileExcel");
const tokenUtil = require("../../utils/token");
const stringUtil = require("../../utils/string");
const sendMailUtil = require("../../utils/sendMail");

const typeService = require("./type.service");

const models = require("../../models/index");
const User = models.User;
const Type = models.Type;

module.exports = {
  countAllUserByType: async (filters, types) => {
    try {
      const { count, rows } = await User.findAndCountAll({
        where: filters,
        include: {
          model: Type,
          where: {
            name: {
              [Op.in]: types,
            },
          },
        },
        attributes: {
          exclude: ["password"],
        },
      });

      return [{ count, rows }, null];
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.USER.COUNT_USER_FAILED];
  },

  createUser: async (name, email, phone, address, typeId) => {
    try {
      const passRandom = tokenUtil.generatePasswordRandom();

      const user = await User.create({
        name,
        email,
        password: tokenUtil.createHashByBcrypt(passRandom),
        phone,
        address: address ? address : null,
        typeId,
      });

      if (!user) {
        return [false, MESSAGE_ERROR.USER.CREATE_USER_FAILED];
      }

      const passActiveAccountHtml = stringUtil.getPassActiveAccountMailHtml(
        email,
        passRandom
      );

      if (!passActiveAccountHtml) {
        return [false, MESSAGE_ERROR.OTHER.READ_MAIL_HTML];
      }

      sendMailUtil(
        email,
        MESSAGE_INFO.PASSWORD_ACTIVE_ACCOUNT,
        passActiveAccountHtml
      );

      return [true, MESSAGE_SUCCESS.USER.CREATE_USER_SUCCESS];
    } catch (err) {
      console.log(err);
      return [false, MESSAGE_ERROR.USER.CREATE_USER_FAILED];
    }
  },

  editUser: async (id, name, email, phone, address, typeId) => {
    try {
      const statusUpdated = await User.update(
        {
          name,
          email,
          phone: phone,
          address: address ? address : null,
          updatedAt: momentUtil.getDateNow(),
          typeId,
        },
        {
          where: {
            id,
          },
        }
      );

      if (statusUpdated) {
        return [true, MESSAGE_SUCCESS.USER.EDIT_USER_SUCCESS];
      }
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.USER.EDIT_USER_FAILED];
  },

  removeUsers: async (userIdList) => {
    try {
      const users = await User.findAll({
        where: {
          id: {
            [Op.in]: userIdList,
          },
        },
      });

      if (users?.length !== userIdList.length) {
        return [false, MESSAGE_ERROR.USER.USER_NOT_FOUND];
      }

      const statusDeleted = await User.destroy({
        where: {
          id: {
            [Op.in]: userIdList,
          },
        },
      });
      if (statusDeleted === userIdList.length) {
        return [true, MESSAGE_SUCCESS.USER.DELETE_USER_SUCCESS];
      }
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.USER.DELETE_USER_FAILED];
  },

  updatePassword: async (userId, password) => {
    try {
      const hash = tokenUtil.createHashByBcrypt(password);
      const user = await User.findByPk(userId);
      if (!user) {
        return [false, MESSAGE_ERROR.USER.USER_NOT_FOUND];
      }

      const statusUpdated = await user.update({
        password: hash,
        firstLogin: 1,
        updatedAt: momentUtil.getDateNow(),
      });

      if (statusUpdated) {
        return [true, MESSAGE_SUCCESS.USER.CHANGE_PASS_SUCCESS];
      }
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.USER.CHANGE_PASS_FAILED];
  },

  sendResetPassLink: async (email) => {
    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return [false, MESSAGE_ERROR.USER.EMAIL_NOT_EXIST];
      }

      const token = tokenUtil.createTokenByJwt(user.id);

      const resetPassHtml = stringUtil.getResetPasswordMailHtml(
        user.name,
        REDIRECT_PATH.EMAIL_PASS_RESET,
        token
      );

      sendMailUtil(user.email, MESSAGE_INFO.RESET_PASS_TITLE, resetPassHtml);

      return [true, MESSAGE_SUCCESS.USER.SENDED_RESET_PASS];
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.USER.SEND_RESET_PASS];
  },

  getUser: async (filters) => {
    try {
      const user = await User.findOne({
        where: filters,
        include: Type,
        attributes: {
          exclude: ["password"],
        },
      });

      if (user) {
        return [user, null];
      } else {
        return [null, MESSAGE_ERROR.USER.USER_NOT_FOUND];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.USER.FIND_USER_FAILED];
  },

  getAllUser: async (types, filters, offset, limit) => {
    try {
      const options = {
        where: filters,
        include: {
          model: Type,
          where: {
            name: {
              [Op.in]: types,
            },
          },
        },
        attributes: {
          exclude: ["password"],
        },
      };

      if (offset) {
        options.offset = offset;
      }

      if (limit) {
        options.limit = limit;
      }

      const users = await User.findAll(options);

      if (users?.length) {
        return [users, null];
      } else {
        return [null, MESSAGE_ERROR.USER.USERS_EMPTY];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.USER.FIND_USER_FAILED];
  },

  importUsers: async function (typeName, fileInfo, userFields) {
    try {
      const [dataArr, messageImport] = await fileExcel.readFile(
        fileInfo,
        userFields
      );

      if (!dataArr) {
        return [false, messageImport];
      }

      const [types] = await typeService.getAllType();
      await Promise.all(
        dataArr.map(async (data) => {
          const obj = types.find((item) => item.name === typeName ?? data.type);
          return await this.createUser(
            data.name,
            data.email,
            data.phone,
            data.address,
            +obj.id
          );
        })
      );

      return [true, MESSAGE_SUCCESS.FILE.IMPORT_USERS_SUCCESS];
    } catch (err) {
      console.log(err);
    }

    return [false, MESSAGE_ERROR.FILE.IMPORT_USERS_FAILED];
  },
};
