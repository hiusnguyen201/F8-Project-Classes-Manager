"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Otp extends Model {
    /**
     * Helper method for defining associations.
    //  * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_Otp.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  User_Otp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      otp: DataTypes.STRING(10),
      expire: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_Otp",
    }
  );
  return User_Otp;
};
