module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('educationBackgrounds', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      major: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      university: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thesisTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ipk: {
        type: Sequelize.FLOAT,
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
      transcripts: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('educationBackgrounds');
  },
};
