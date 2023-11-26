"use strict";
const moment = require("moment");
const momentUtil = require("../../utils/moment.util");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "types",
      [
        {
          name: "admin",
          createdAt: momentUtil.getTimeUTC(),
          updatedAt: momentUtil.getTimeUTC(),
        },
        {
          name: "teacher",
          createdAt: momentUtil.getTimeUTC(),
          updatedAt: momentUtil.getTimeUTC(),
        },
        {
          name: "student",
          createdAt: momentUtil.getTimeUTC(),
          updatedAt: momentUtil.getTimeUTC(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("types", null, {});
  },
};
