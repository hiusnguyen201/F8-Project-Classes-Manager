"use strict";
const tokenUtil = require("../../utils/token");
const momentUtil = require("../../utils/moment");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [];

    for (var i = 0; i < 50; i++) {
      data.push({
        name: `user${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `0912345678`,
        address: `Viet Nam`,
        typeId: 3,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });
    }
    for (var i = 50; i < 70; i++) {
      data.push({
        name: `user${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `0912345678`,
        address: `Viet Nam`,
        typeId: 2,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });
    }
    for (var i = 70; i < 90; i++) {
      data.push({
        name: `user${i + 1}`,
        email: `user${i + 1}@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `0912345678`,
        address: `Viet Nam`,
        typeId: 1,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      });
    }

    data.push(
      {
        name: `hieu nguyen`,
        email: `hiusnguyen201@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `0123456789`,
        address: `Viet Nam`,
        typeId: 1,
        createdAt: momentUtil.getDateNow(),
        updatedAt: momentUtil.getDateNow(),
      },
      {
        name: `hiusinsane`,
        email: `hiusinsane@gmail.com`,
        password: tokenUtil.createHashByBcrypt("123456"),
        phone: `0123456789`,
        address: `Viet Nam`,
        typeId: 2,
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
