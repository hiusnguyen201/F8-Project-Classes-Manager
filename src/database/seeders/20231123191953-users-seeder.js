"use strict";
const tokenUtil = require("../../utils/token.util");
const momentUtil = require("../../utils/moment.util");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [];

    // Student
    for (let i = 0; i < 30; ++i) {
      data.push({
        name: `user ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `012345678${i}${i + 1}`,
        address: `Viet Nam ${i + 1}`,
        type_id: 3,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });
    }

    // Teacher
    for (let i = 30; i < 45; ++i) {
      data.push({
        name: `user ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `012345678${i}${i + 1}`,
        address: `Viet Nam ${i + 1}`,
        type_id: 2,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });
    }

    // Admmin
    for (let i = 45; i < 50; ++i) {
      data.push({
        name: `user ${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `012345678${i}${i + 1}`,
        address: `Viet Nam ${i + 1}`,
        type_id: 1,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });
    }

    await queryInterface.bulkInsert("users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
