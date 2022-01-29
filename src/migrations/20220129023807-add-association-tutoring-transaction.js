module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tutoringTransaction',
      'studentId',
      {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
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
      'tutoringTransaction',
      'studentId',
    );
  },
};
