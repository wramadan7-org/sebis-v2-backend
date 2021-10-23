module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('prices', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    private: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    group: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('prices'),
};
