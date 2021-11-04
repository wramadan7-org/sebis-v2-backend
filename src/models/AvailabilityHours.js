const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const AvailabilityHours = sequelize.define('availabilityHours', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  dayCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeStart: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeEnd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  paranoid: true,
});

module.exports = {
  AvailabilityHours,
};
