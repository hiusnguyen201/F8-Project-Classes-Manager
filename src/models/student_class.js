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
      Student_Class.belongsTo(models.User, { foreignKey: "student_id" });
      Student_Class.belongsTo(models.Class, { foreignKey: "class_id" });
      Student_Class.belongsTo(models.Learning_Status, {
        foreignKey: "status_id",
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
      student_id: DataTypes.INTEGER,
      class_id: DataTypes.INTEGER,
      status_id: DataTypes.INTEGER,
      reason: DataTypes.STRING(100),
      complete_date: DataTypes.DATE,
      dropout_date: DataTypes.DATE,
      recover_date: DataTypes.DATE,
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
