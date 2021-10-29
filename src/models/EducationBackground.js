const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const EducationBackground = sequelize.define('educationBackground', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  educationMajor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  educationLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  universityName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thesisTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  educationGpa: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  educationFrom: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  educationTo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  educationTranscript: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  educationFile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  paranoid: true,
});

module.exports = {
  EducationBackground,
};
