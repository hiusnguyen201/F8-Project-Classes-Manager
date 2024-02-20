const { Op } = require("sequelize");
const { MESSAGE_ERROR } = require("../../constants/message.constant");
const models = require("../../models/index");
const Type = models.Type;

module.exports = {
  getAllType: async (names) => {
    try {
      const filters = {};
      if (names)
        filters.name = {
          [Op.in]: names,
        };

      const types = await Type.findAll({
        where: filters,
      });

      if (types?.length) {
        return [types, null];
      } else {
        return [null, MESSAGE_ERROR.TYPE.TYPES_EMPTY];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.TYPE.FIND_TYPE_FAILED];
  },

  getType: async (filters) => {
    try {
      const type = await Type.findOne({
        where: filters,
      });

      if (type) {
        return [type, null];
      } else {
        return [false, MESSAGE_ERROR.TYPE.TYPE_NOT_FOUND];
      }
    } catch (err) {
      console.log(err);
    }

    return [null, MESSAGE_ERROR.TYPE.FIND_TYPE_FAILED];
  },
};