const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const TeachingExperience = sequelize.define('teachingExperience', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  institute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjects: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teachingStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  from: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  to: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  cv: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  TeachingExperience,
};
