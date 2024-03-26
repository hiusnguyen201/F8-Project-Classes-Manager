"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Learning_Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically./
     */
    static associate(models) {
      Learning_Status.hasMany(models.Student_Class, { foreignKey: "statusId" });
    }
  }
  Learning_Status.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING(100),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Learning_Status",
    }
  );
  return Learning_Status;
};
