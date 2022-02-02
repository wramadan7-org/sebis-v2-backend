const { DataTypes, Sequelize } = require('sequelize');
const moment = require('moment');
const { sequelize } = require('../config/database');

const TeacherSubject = sequelize.define('teacherSubject', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  gradeId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  subjectId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('private', 'group'),
    defaultValue: Sequelize.ENUM('private'),
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:00'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: moment().format('YYYY-MM-DD HH:mm:00'),
  },
},
{
  paranoid: true,
});

module.exports = {
  TeacherSubject,
};
