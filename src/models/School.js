const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const School = sequelize.define('school', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  School,
};
