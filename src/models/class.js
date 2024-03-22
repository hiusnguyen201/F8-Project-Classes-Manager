"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically./
     */
    static associate(models) {
      Class.belongsTo(models.Course, { foreignKey: "courseId" });
      Class.hasMany(models.Comment, { foreignKey: "id" });
      Class.hasOne(models.Student_Class, { foreignKey: "id" });
      Class.hasMany(models.Student_Attendance, { foreignKey: "id" });
      Class.hasMany(models.Exercise, { foreignKey: "id" });

      Class.hasMany(models.Teacher_Calender, {
        foreignKey: "classId",
        onDelete: "CASCADE",
        hooks: true,
      });

      Class.hasMany(models.Class_Schedule, {
        foreignKey: "classId",
        onDelete: "CASCADE",
        hooks: true,
      });

      Class.belongsToMany(models.User, {
        foreignKey: "classId",
        through: "classes_teachers",
        hooks: true,
      });
    }
  }
  Class.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING(200),
      quantity: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      courseId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Class",
      paranoid: true,
    }
  );
  return Class;
};
