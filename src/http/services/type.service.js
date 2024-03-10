const { Op } = require("sequelize");

const models = require("../../models/index");
const Type = models.Type;

class TypeService {
  constructor() {
    this.Type = Type;
  }

  async findByName(name) {
    const type = await this.Type.findOne({
      where: {
        name,
      },
    });

    return type ? type : null;
  }

  async findAllByTypes(names) {
    const filters = {};

    if (names && names?.length) {
      filters.name = {
        [Op.in]: names,
      };
    }

    const types = await this.Type.findAll({
      where: filters,
    });

    return types;
  }
}

module.exports = TypeService;
