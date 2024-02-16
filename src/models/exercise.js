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
      Exercise.belongsTo(models.Class, { foreignKey: "classId" });
      Exercise.belongsTo(models.User, { foreignKey: "teacherId" });
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
      classId: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Exercise",
    }
  );
  return Exercise;
};
