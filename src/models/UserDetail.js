const { sequelize, DataTypes } = require('../config/database');

const UserDetail = sequelize.define('userDetail', {
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
