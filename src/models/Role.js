const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const Role = sequelize.define('role', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  roleName: {
    type: DataTypes.ENUM('teacher', 'student'),
    unique: true,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  Role,
};
