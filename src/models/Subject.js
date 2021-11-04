const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Subject = sequelize.define('subject', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  subjectCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  paranoid: true,
});

module.exports = {
  Subject,
};
