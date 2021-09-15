const {DataTypes} = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      roleName: {
        type: DataTypes.ENUM('teacher', 'student'),
        unique: true,
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
    });

    await queryInterface.addColumn(
      'users',
      'roleId',
      {
        type: Sequelize.STRING,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
    await queryInterface.removeColumn(
      'users',
      'roleId',
    );
  }
};
