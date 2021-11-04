const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Grade = sequelize.define('grade', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  gradeCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gradeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  paranoid: true,
});

module.exports = {
  Grade,
};
