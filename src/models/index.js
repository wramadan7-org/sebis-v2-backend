const { sequelize } = require('../config/database');
const { User } = require('./User');
const { UserDetail } = require('./UserDetail');
const { School } = require('./School');
const { Role } = require('./Role');
const { Cart } = require('./Cart');
const { CartItem } = require('./CartItem');
const { Price } = require('./Price');
const { TeachingExperience } = require('./TeachingExperience');
const { TeachingExperienceDetail } = require('./TeachingExperienceDetail');
const { EducationBackground } = require('./EducationBackground');
const { File } = require('./Files');

const setupSequelizeAssociations = async () => {
  User.belongsTo(Role);

  User.belongsTo(School);

  // User.hasOne(Cart, {
  //   foreignKey: 'studentId',
  // });
  User.hasOne(UserDetail);

  UserDetail.hasOne(Price);

  UserDetail.belongsTo(User);

  Price.belongsTo(UserDetail);

  School.hasMany(User);

  Role.hasMany(User);

  Cart.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
  });

  User.hasOne(Cart, {
    foreignKey: 'studentId',
    as: 'student',
  });

  CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
  });

  Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
  });

  CartItem.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(CartItem, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(TeachingExperience, {
    foreignKey: 'teacherId',
  });

  TeachingExperience.belongsTo(User, {
    foreignKey: 'teacherId',
  });

  TeachingExperience.hasMany(TeachingExperienceDetail, {
    foreignKey: 'teachingExperienceId',
  });

  TeachingExperienceDetail.belongsTo(TeachingExperience, {
    foreignKey: 'teachingExperienceId',
  });

  User.hasMany(EducationBackground, {
    foreignKey: 'teacherId',
  });

  EducationBackground.belongsTo(User, {
    foreignKey: 'teacherId',
  });

  User.hasMany(File, {
    foreignKey: 'userId',
  });

  File.belongsTo(User, {
    foreignKey: 'userId',
  });

  // finally sync sequelize
  // await sequelize.sync();
};

module.exports = setupSequelizeAssociations;
