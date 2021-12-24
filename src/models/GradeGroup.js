const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const GradeGroup = sequelize.define('gradeGroup', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  gradeGroupCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gradeGroupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temporaryGradeId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
  paranoid: true,
});

module.exports = {
  GradeGroup,
};
