"use strict";
const tokenUtil = require("../../utils/token.util");
const momentUtil = require("../../utils/moment.util");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [];

    data.push(
      {
        name: `hieu nguyen`,
        email: `hiusnguyen201@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `0123456789`,
        address: `Viet Nam`,
        type_id: 1,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      },
      {
        name: `hiusinsane`,
        email: `hiusinsane@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `0123456789`,
        address: `Viet Nam`,
        type_id: 2,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      }
    );

    await queryInterface.bulkInsert("users", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
