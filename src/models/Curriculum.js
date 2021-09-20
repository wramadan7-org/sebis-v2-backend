const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const Curriculum = sequelize.define('curriculum', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  curriculumName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  Curriculum,
};
