"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically./
     */
    static associate(models) {
      Course.belongsTo(models.User, { foreignKey: "teacherId" });
      Course.hasMany(models.Class, { foreignKey: "courseId" });
      Course.hasMany(models.Course_Module, { foreignKey: "courseId" });
    }
  }
  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING(200),
      price: DataTypes.INTEGER,
      teacherId: DataTypes.INTEGER,
      tryLearn: DataTypes.TINYINT,
      quantity: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Course",
      paranoid: true,
    }
  );
  return Course;
};
