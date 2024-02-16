"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher_Calender extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle./
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Teacher_Calender.belongsTo(models.User, { foreignKey: "teacherId" });
      Teacher_Calender.belongsTo(models.Class, { foreignKey: "classId" });
    }
  }
  Teacher_Calender.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      scheduleDate: DataTypes.DATE,
      teacherId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Teacher_Calender",
    }
  );
  return Teacher_Calender;
};
