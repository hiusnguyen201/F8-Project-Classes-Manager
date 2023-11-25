"use strict";
const bcryptUtil = require("../../utils/bcrypt.util");
const momentUtil = require("../../utils/moment.util");
//
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [];

    // Student
    for (let i = 0; i < 30; ++i) {
      data.push({
        name: `user ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: bcryptUtil.makeHash("123456"),
        phone: `012345678${i}${i + 1}`,
        address: `Viet Nam ${i + 1}`,
        type_id: 3,
        createdAt: momentUtil.getTimeUTC(),
        updatedAt: momentUtil.getTimeUTC(),
      });
    }

    // Teacher
    for (let i = 30; i < 45; ++i) {
      data.push({
        name: `user ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: bcryptUtil.makeHash("123456"),
        phone: `012345678${i}${i + 1}`,
        address: `Viet Nam ${i + 1}`,
        type_id: 2,
        createdAt: momentUtil.getTimeUTC(),
        updatedAt: momentUtil.getTimeUTC(),
      });
    }

    // Admmin
    for (let i = 45; i < 50; ++i) {
      data.push({
        name: `user ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: bcryptUtil.makeHash("123456"),
        phone: `012345678${i}${i + 1}`,
        address: `Viet Nam ${i + 1}`,
        type_id: 1,
        createdAt: momentUtil.getTimeUTC(),
        updatedAt: momentUtil.getTimeUTC(),
      });
    }

    await queryInterface.bulkInsert("users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
