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
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  religion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idCardType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idCardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mailingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'indonesia',
  },
  aboutMe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  UserDetail,
};
