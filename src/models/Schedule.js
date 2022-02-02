const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const {
  PENDING, ACCEPT, PROCESS, EXPIRE, REJECT, DONE, DELETE,
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
    type: DataTypes.ENUM(ACCEPT, PENDING, REJECT, EXPIRE, PROCESS, DONE, DELETE),
    allowNull: false,
  },
  requestMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  paranoid: true,
});

module.exports = {
  Schedule,
};
