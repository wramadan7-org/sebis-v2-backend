const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const {
  PENDING, ACCEPT, PROCESS, EXPIRE, REJECT, DONE,
} = process.env;

const Schedule = sequelize.define('schedule', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  dateSchedule: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  typeClass: {
    type: DataTypes.ENUM('private', 'group'),
    allowNull: true,
  },
  statusSchedule: {
    type: DataTypes.ENUM(ACCEPT, PENDING, REJECT, EXPIRE, PROCESS, DONE),
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacherSubjectId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availabilityHoursId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  Schedule,
};
