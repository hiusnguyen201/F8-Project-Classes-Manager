"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Student_Classes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      classId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "classes",
          },
          key: "id",
        },
      },
      statusId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "learning_statuses",
          },
          key: "id",
        },
      },
      reason: {
        type: Sequelize.STRING(100),
      },
      completeDate: {
        type: Sequelize.DATE,
      },
      dropoutDate: {
        type: Sequelize.DATE,
      },
      recoverDate: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Student_Classes");
  },
};
//
