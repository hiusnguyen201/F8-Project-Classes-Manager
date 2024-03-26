"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher_Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle./
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Teacher_Calendar.hasMany(models.Student_Attendance, {
        foreignKey: "calendarId",
      });
      Teacher_Calendar.belongsTo(models.User, { foreignKey: "teacherId" });
      Teacher_Calendar.belongsTo(models.Class, { foreignKey: "classId" });
    }
  }
  Teacher_Calendar.init(
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
      modelName: "Teacher_Calendar",
    }
  );
  return Teacher_Calendar;
};
