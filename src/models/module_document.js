"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Module_Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Module_Document.belongsTo(models.Course_Module, {
        foreignKey: "module_id",
      });
    }
  }
  Module_Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      path_name: DataTypes.STRING(200),
      module_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Module_Document",
    }
  );
  return Module_Document;
};
