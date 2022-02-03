const moment = require('moment');
const { DataTypes, SequelizeInstance, sequelize } = require('../config/database');

const Message = sequelize.define('message', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recipientId: {
    type: DataTypes.STRING,
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
}, {
  paranoid: true,
});

module.exports = {
  Message,
};
