"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student_Class extends Model {
    /**
     * Helper method for defining associations./
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student_Class.belongsTo(models.User, { foreignKey: "studentId" });
      Student_Class.belongsTo(models.Class, { foreignKey: "classId" });
      Student_Class.belongsTo(models.Learning_Status, {
        foreignKey: "statusId",
      });
    }
  }
  Student_Class.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
      statusId: DataTypes.INTEGER,
      reason: DataTypes.STRING(100),
      completeDate: DataTypes.DATE,
      dropoutDate: DataTypes.DATE,
      recoverDate: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Student_Class",
    }
  );
  return Student_Class;
};
