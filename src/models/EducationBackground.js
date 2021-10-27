const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const EducationBackground = sequelize.define('educationBackground', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  major: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  university: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thesisTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ipk: {
    type: DataTypes.FLOAT,
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
  transcripts: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  paranoid: true,
});

module.exports = {
  EducationBackground,
};
