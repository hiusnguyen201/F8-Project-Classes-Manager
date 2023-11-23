"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_columns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_columns.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  User_columns.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      feature_name: DataTypes.STRING(100),
      status: DataTypes.TINYINT(1),
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_columns",
    }
  );
  return User_columns;
};
