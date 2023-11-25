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
      Class.belongsTo(models.Course, { foreignKey: "course_id" });
      Class.hasMany(models.Comment, { foreignKey: "id" });
      Class.hasOne(models.Student_Class, { foreignKey: "id" });
      Class.hasOne(models.Teacher_Calender, { foreignKey: "id" });
      Class.belongsToMany(models.User, { through: "classes_teachers" });
      Class.hasMany(models.Student_Attendance, { foreignKey: "id" });
      Class.hasMany(models.Exercise, { foreignKey: "id" });
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
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      schedule: DataTypes.TINYINT(1),
      time_learn: DataTypes.STRING(50),
      course_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Class",
    }
  );
  return Class;
};
