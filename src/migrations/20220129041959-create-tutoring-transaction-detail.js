module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'tutoringTransactionDetail',
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        teacherName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lessonSchedule: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        subject: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        grade: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        discount: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        price: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tutoringTransactionDetail');
  },
};
