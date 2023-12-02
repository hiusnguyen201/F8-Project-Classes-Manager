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
      Submit_Exercise.belongsTo(models.User, { foreignKey: "student_id" });
      Submit_Exercise.belongsTo(models.Exercise, { foreignKey: "exercise_id" });
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
      student_id: DataTypes.INTEGER,
      exercise_id: DataTypes.INTEGER,
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
