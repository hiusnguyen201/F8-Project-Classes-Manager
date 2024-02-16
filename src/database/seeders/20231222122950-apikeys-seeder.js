"use strict";
const momentUtil = require("../../utils/moment");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Apikeys", [
      {
        value: "0f9f51d7-cdd9-47e0-a2bd-f2e12c0c0d63",
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      },
      {
        value: "8b8130de-08dd-4432-90fc-2a6cc392c0b1",
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      },
      {
        value: "a5b4f9f4-d182-4a4a-a45b-287887a4c941",
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Apikeys", null, {});
  },
};
