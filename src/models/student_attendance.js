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
      Student_Attendance.belongsTo(models.User, { foreignKey: "student_id" });
      Student_Attendance.belongsTo(models.Class, { foreignKey: "class_id" });
    }
  }
  Student_Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date_learning: DataTypes.DATE,
      status: DataTypes.TINYINT(1),
      student_id: DataTypes.INTEGER,
      class_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Student_Attendance",
    }
  );
  return Student_Attendance;
};
