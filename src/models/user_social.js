"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Social extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle./
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_Social.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  User_Social.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      provider: DataTypes.STRING(100),
      provider_id: DataTypes.STRING(100),
    },
    {
      sequelize,
      modelName: "User_Social",
    }
  );
  return User_Social;
};
