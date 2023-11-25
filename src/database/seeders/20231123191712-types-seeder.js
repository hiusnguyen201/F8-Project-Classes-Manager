"use strict";
const moment = require("moment");
const momentUtil = require("../../utils/moment.util");
//
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "types",
      [
        {
          name: "admin",
          createdAt: momentUtil.getTimeNow(),
          updatedAt: momentUtil.getTimeNow(),
        },
        {
          name: "teacher",
          createdAt: momentUtil.getTimeNow(),
          updatedAt: momentUtil.getTimeNow(),
        },
        {
          name: "student",
          createdAt: momentUtil.getTimeNow(),
          updatedAt: momentUtil.getTimeNow(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("types", null, {});
  },
};
