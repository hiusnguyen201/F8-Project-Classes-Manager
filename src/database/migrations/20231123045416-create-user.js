"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      email: {
        type: Sequelize.STRING(100),
        unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
      },
      phone: {
        type: Sequelize.STRING(15),
      },
      address: {
        type: Sequelize.STRING(200),
      },
      first_login: {
        type: Sequelize.TINYINT(1),
      },
      type_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "types",
          },
          key: "id",
        },
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
    await queryInterface.dropTable("Users");
  },
};
