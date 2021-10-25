const { genders } = require('../config/users');

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'phoneNumber', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      after: 'email',
    }),
    queryInterface.addColumn('users', 'gender', {
      type: Sequelize.ENUM(Object.values(genders)),
      allowNull: false,
      after: 'password',
    }),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('users', 'phoneNumber'),
    queryInterface.removeColumn('users', 'gender'),
  ])
};
