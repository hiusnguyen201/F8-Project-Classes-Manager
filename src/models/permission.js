'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.belongsToMany(models.Role, { through: "roles_permissions" });
      Permission.belongsToMany(models.User, { through: "users_permissions" });
    }
  }
  Permission.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    values: DataTypes.STRING(150)
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};