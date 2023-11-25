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
      Course_Module.belongsTo(models.Course, { foreignKey: "course_id" });
      Course_Module.hasMany(models.Module_Document, { foreignKey: "id" });
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
      course_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course_Module",
    }
  );
  return Course_Module;
};
