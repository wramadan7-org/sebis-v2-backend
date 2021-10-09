const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const Curriculum = sequelize.define('curriculum', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  curriculumName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  Curriculum,
};
