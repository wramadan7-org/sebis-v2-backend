module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('carts', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    studentId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('carts'),
};
