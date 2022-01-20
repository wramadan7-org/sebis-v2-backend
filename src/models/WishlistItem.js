const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const WishlistItem = sequelize.define('WishlistItems', {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
  },
  typeCourse: {
    type: DataTypes.ENUM('private', 'group'),
    allowNull: false,
  },
  dateTimeStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dateTimeEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
},
{
  paranoid: true,
});

module.exports = {
  WishlistItem,
};
