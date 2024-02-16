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
      User_Social.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  User_Social.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      provider: DataTypes.STRING(100),
      provider_id: DataTypes.STRING(100),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User_Social",
    }
  );
  return User_Social;
};
