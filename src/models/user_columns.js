"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Column extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle./
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_Column.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  User_Column.init(
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
      modelName: "User_Column",
    }
  );
  return User_Column;
};
