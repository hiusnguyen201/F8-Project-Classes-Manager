"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course_Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically./
     */
    static associate(models) {
      Course_Module.belongsTo(models.Course, {
        foreignKey: "courseId",
      });
      Course_Module.hasMany(models.Module_Document, {
        foreignKey: "moduleId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Course_Module.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING(200),
      courseId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Course_Module",
    }
  );
  return Course_Module;
};
