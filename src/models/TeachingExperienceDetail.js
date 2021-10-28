const { sequelize, SequelizeInstance, DataTypes } = require('../config/database');

const TeachingExperienceDetail = sequelize.define('teachingExperienceDetail', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: SequelizeInstance.UUIDV4,
    allowNull: false,
  },
  gradeCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true,
});

module.exports = {
  TeachingExperienceDetail,
};
