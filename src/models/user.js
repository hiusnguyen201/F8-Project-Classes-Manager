"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Type, { foreignKey: "type_id" });
      User.hasOne(models.Login_Token, { foreignKey: "id" });
      User.hasOne(models.User_Otp, { foreignKey: "id" });
      User.hasMany(models.User_Social, { foreignKey: "id" });
      User.hasMany(models.User_Column, { foreignKey: "id" });
      User.belongsToMany(models.Role, { through: "users_roles" });
      User.belongsToMany(models.Permission, { through: "users_permissions" });
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
      first_login: DataTypes.TINYINT(1),
      type_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
