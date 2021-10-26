module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('teachingExperiences', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      institute: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      grade: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subjects: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      teachingStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      to: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      cv: {
        type: Sequelize.STRING,
        allowNull: false,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('teachingExperiences');
  },
};
