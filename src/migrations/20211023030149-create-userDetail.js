module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('userDetails', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    birthPlace: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    birthDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    religion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idCardType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    idCardNumber: {
      type: Sequelize.STRING,
      // unique: true,
      allowNull: false,
    },
    mailingAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    postalCode: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      defaultValue: 'indonesia',
    },
    aboutMe: {
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
  }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('userDetails'),
};
