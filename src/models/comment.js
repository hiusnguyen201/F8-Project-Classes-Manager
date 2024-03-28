"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically./
     */
    static associate(models) {
      Comment.belongsTo(models.Class, { foreignKey: "classId" });
      Comment.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: DataTypes.STRING(200),
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      classId: DataTypes.INTEGER,
      parentId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
