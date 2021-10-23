const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const Price = sequelize.define('price', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  private: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  group: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  Price,
};
