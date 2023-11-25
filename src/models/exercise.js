"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically./
     */
    static associate(models) {
      Exercise.belongsTo(models.Class, { foreignKey: "class_id" });
      Exercise.belongsTo(models.User, { foreignKey: "teacher_id" });
      Exercise.hasMany(models.Submit_Exercise, { foreignKey: "id" });
    }
  }
  Exercise.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING(200),
      attachment: DataTypes.STRING(200),
      content: DataTypes.TEXT,
      class_id: DataTypes.INTEGER,
      teacher_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Exercise",
    }
  );
  return Exercise;
};
