const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const ReferralHistory = sequelize.define('referralHistory', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  referralCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  ReferralHistory,
};
