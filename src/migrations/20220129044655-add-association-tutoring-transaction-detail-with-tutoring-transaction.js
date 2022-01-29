module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tutoringTransactionDetail',
      'tutoringTransactionId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'tutoringTransaction',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: 'id',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'tutoringTransactionDetail',
      'tutoringTransactionId',
    );
  },
};
