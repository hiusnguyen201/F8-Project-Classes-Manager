"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle./
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Type, { foreignKey: "typeId" });
      User.hasOne(models.Login_Token, { foreignKey: "id" });
      User.hasOne(models.User_Otp, { foreignKey: "id" });
      User.hasMany(models.User_Social, { foreignKey: "id" });
      User.hasMany(models.User_Column, { foreignKey: "id" });
      User.belongsToMany(models.Role, {
        foreignKey: "userId",
        through: "users_roles",
      });
      User.belongsToMany(models.Permission, {
        foreignKey: "userId",
        through: "users_permissions",
      });

      User.hasOne(models.Course, { foreignKey: "id" });
      User.hasOne(models.Student_Class, { foreignKey: "id" });
      User.hasMany(models.Teacher_Calender, { foreignKey: "id" });

      User.hasMany(models.Student_Attendance, { foreignKey: "id" });
      User.hasMany(models.Exercise, { foreignKey: "id" });
      User.hasMany(models.Submit_Exercise, { foreignKey: "id" });

      User.belongsToMany(models.Class, {
        foreignKey: "teacherId",
        through: "class_teachers",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING(100),
      email: DataTypes.STRING(100),
      password: DataTypes.STRING(100),
      phone: DataTypes.STRING(15),
      address: DataTypes.STRING(200),
      firstLogin: DataTypes.TINYINT,
      typeId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
    }
  );
  return User;
};
