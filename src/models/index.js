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
const { Curriculum } = require('./Curriculum');
const { Grade } = require('./Grade');
const { GradeGroup } = require('./GradeGroup');
const { Subject } = require('./Subject');
const { TeacherSubject } = require('./TeacherSubject');
const { AvailabilityHours } = require('./AvailabilityHours');
const { ReferralHistory } = require('./ReferralHistory');

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

  Curriculum.hasMany(GradeGroup, {
    foreignKey: 'curriculumId',
  });

  GradeGroup.belongsTo(Curriculum, {
    foreignKey: 'curriculumId',
  });

  GradeGroup.hasMany(Grade, {
    foreignKey: 'gradeGroupId',
  });

  Grade.belongsTo(GradeGroup, {
    foreignKey: 'gradeGroupId',
  });

  Subject.hasMany(TeacherSubject, {
    foreignKey: 'subjectId',
  });

  TeacherSubject.belongsTo(Subject, {
    foreignKey: 'subjectId',
  });

  Grade.hasMany(TeacherSubject, {
    foreignKey: 'gradeId',
  });

  TeacherSubject.belongsTo(Grade, {
    foreignKey: 'gradeId',
  });

  User.hasMany(TeacherSubject, {
    foreignKey: 'teacherId',
  });

  TeacherSubject.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(AvailabilityHours, {
    foreignKey: 'teacherId',
  });

  AvailabilityHours.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.belongsTo(User, {
    foreignKey: 'referredBy',
    as: 'referrerUser',
  });

  User.hasMany(User, {
    foreignKey: 'referredBy',
    as: 'referredUsers',
  });

  User.hasOne(ReferralHistory, {
    foreignKey: 'userId',
  });

  ReferralHistory.belongsTo(User, {
    foreignKey: 'userId',
  });

  User.hasOne(ReferralHistory, {
    foreignKey: 'referredBy',
  });

  ReferralHistory.belongsTo(User, {
    foreignKey: 'referredBy',
  });

  // finally sync sequelize
  // await sequelize.sync();
};

module.exports = setupSequelizeAssociations;
