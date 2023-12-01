"use strict";
const momentUtil = require("../../utils/moment.util");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "types",
      [
        {
          name: "admin",
          createdAt: momentUtil.getDateNow(),
          updatedAt: momentUtil.getDateNow(),
        },
        {
          name: "teacher",
          createdAt: momentUtil.getDateNow(),
          updatedAt: momentUtil.getDateNow(),
        },
        {
          name: "student",
          createdAt: momentUtil.getDateNow(),
          updatedAt: momentUtil.getDateNow(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("types", null, {});
  },
};
