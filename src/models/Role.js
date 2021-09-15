const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  roleName: {
    type: DataTypes.ENUM('teacher', 'student'),
    unique: true,
    allowNull: false,
  },
});

module.exports = {
  Role,
};
