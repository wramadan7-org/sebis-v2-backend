const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const School = sequelize.define('school', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolAddress: {
    type: DataTypes.STRING,
  },
}, {
  paranoid: true,
});

module.exports = {
  School,
};
