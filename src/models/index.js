const { sequelize } = require('../config/database');
const { User } = require('./User');
const { UserDetail } = require('./UserDetail');
const { School } = require('./School');
const { Role } = require('./Role');
const { Cart } = require('./Cart');
const { Price } = require('./Price');
const { TeachingExperience } = require('./TeachingExperience');
const { EducationBackground } = require('./EducationBackground');

const setupSequelizeAssociations = async () => {
  User.belongsTo(Role);
  User.belongsTo(School);
  User.hasOne(Cart, {
    foreignKey: 'studentId',
  });
  User.hasOne(UserDetail);

  UserDetail.hasOne(Price);
  UserDetail.belongsTo(User);

  Price.belongsTo(UserDetail);

  School.hasMany(User);

  Role.hasMany(User);

  Cart.belongsTo(User, {
    foreignKey: 'studentId',
  });

  User.hasMany(TeachingExperience, {
    foreignKey: 'teacherId',
  });

  TeachingExperience.belongsTo(User, {
    foreignKey: 'teacherId',
  });

  User.hasMany(EducationBackground, {
    foreignKey: 'teacherId',
  });

  EducationBackground.belongsTo(User, {
    foreignKey: 'teacherId',
  });

  // finally sync sequelize
  await sequelize.sync();
};

module.exports = setupSequelizeAssociations;
