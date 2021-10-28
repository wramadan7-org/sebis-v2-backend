const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const TeachingExperience = sequelize.define('teachingExperience', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  universityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  universityCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teachingStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teachingFrom: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  teachingTo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  TeachingExperience,
};
