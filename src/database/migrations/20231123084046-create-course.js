"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Courses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(250),
      },
      price: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
        },
        key: "id",
      },
      tryLearn: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Courses");
  },
};
//
