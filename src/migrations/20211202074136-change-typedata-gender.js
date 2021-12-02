'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'users',
      'gender',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'users',
      'gender',
      {
        type: Sequelize.ENUM(Object.values(genders)),
        allowNull: true,
      }
    );
  }
};
