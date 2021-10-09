const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  Cart,
};
