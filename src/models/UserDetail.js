const { teacherStatuses } = require('../config/users');
const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const UserDetail = sequelize.define('userDetail', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  birthPlace: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  religion: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'ISLAM',
  },
  idCardType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'KTP',
  },
  idCardNumber: {
    type: DataTypes.STRING,
    // unique: true,
    allowNull: true,
    defaultValue: null,
  },
  mailingAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  postalCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'INDONESIA',
  },
  aboutMe: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  teacherStatus: {
    type: DataTypes.ENUM(Object.values(teacherStatuses)),
    defaultValue: teacherStatuses.PENDING,
  },
}, {
  paranoid: true,
});

module.exports = {
  UserDetail,
};
