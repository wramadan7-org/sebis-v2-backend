const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE,
} = process.env;

const CartItem = sequelize.define('cartItem', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  cartItemStatus: {
    type: DataTypes.ENUM(PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE),
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
  requestMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageMaterial: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},
{
  paranoid: true,
});

module.exports = {
  CartItem,
};
