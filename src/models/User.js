const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    primaryKey: true,
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
  },
});

module.exports = {
  User,
};