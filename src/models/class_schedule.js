"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class_Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Class_Schedule.belongsTo(models.Class, { foreignKey: "classId" });
    }
  }
  Class_Schedule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      classId: DataTypes.INTEGER,
      schedule: DataTypes.TINYINT,
      timeLearn: DataTypes.STRING(50),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Class_Schedule",
    }
  );
  return Class_Schedule;
};
