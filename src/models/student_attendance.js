"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student_Attendance extends Model {
    /**
     * Helper method for defining associations./
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student_Attendance.belongsTo(models.User, { foreignKey: "studentId" });
      Student_Attendance.belongsTo(models.Teacher_Calendar, {
        foreignKey: "calendarId",
      });
    }
  }
  Student_Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: DataTypes.TINYINT,
      studentId: DataTypes.INTEGER,
      calendarId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Student_Attendance",
    }
  );
  return Student_Attendance;
};
