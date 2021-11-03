const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  cartItemStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeCourse: {
    type: DataTypes.ENUM('private', 'group'),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
},
{
  paranoid: true,
});

module.exports = {
  CartItem,
};
