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
}, {
  paranoid: true,
});

module.exports = {
  Message,
};
