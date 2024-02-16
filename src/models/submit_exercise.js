"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Submit_Exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle./
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Submit_Exercise.belongsTo(models.User, { foreignKey: "studentId" });
      Submit_Exercise.belongsTo(models.Exercise, { foreignKey: "exerciseId" });
    }
  }
  Submit_Exercise.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: DataTypes.TEXT,
      attachment: DataTypes.STRING(200),
      studentId: DataTypes.INTEGER,
      exerciseId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Submit_Exercise",
    }
  );
  return Submit_Exercise;
};
