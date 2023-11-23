"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Login_Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Login_Token.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Login_Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: DataTypes.STRING(100),
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Login_Token",
    }
  );
  return Login_Token;
};
