const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const TeacherSubject = sequelize.define('teacherSubject', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
},
{
  paranoid: true,
});

module.exports = {
  TeacherSubject,
};
