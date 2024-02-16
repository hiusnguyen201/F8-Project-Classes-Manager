"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Courses",
          "deletedAt",
          {
            type: Sequelize.DataTypes.DATE,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "Classes",
          "deletedAt",
          {
            type: Sequelize.DataTypes.DATE,
          },
          { transaction: t }
        ),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Courses", "deletedAt", { transaction: t }),
        queryInterface.removeColumn("Classes", "deletedAt", {
          transaction: t,
        }),
      ]);
    });
  },
};
