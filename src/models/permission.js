"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically./
     */
    static associate(models) {
      Permission.belongsToMany(models.User, {
        foreignKey: "permission_id",
        through: "users_permissions",
      });
      Permission.belongsToMany(models.Role, {
        foreignKey: "permission_id",
        through: "roles_permissions",
      });
    }
  }
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      values: DataTypes.STRING(150),
    },
    {
      sequelize,
      modelName: "Permission",
    }
  );
  return Permission;
};
