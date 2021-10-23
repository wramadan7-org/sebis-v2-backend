const { sequelize } = require('../config/database');
const { User } = require('./User');
const { UserDetail } = require('./UserDetail');
const { School } = require('./School');
const { Role } = require('./Role');
const { Cart } = require('./Cart');

const setupSequelizeAssociations = async () => {
  User.belongsTo(Role);
  User.belongsTo(School);
  User.hasOne(Cart, {
    foreignKey: 'studentId',
  });
  User.hasOne(UserDetail);

  UserDetail.belongsTo(User);

  School.hasMany(User);

  Role.hasMany(User);

  Cart.belongsTo(User, {
    foreignKey: 'studentId',
  });

  // finally sync sequelize
  await sequelize.sync();
};

module.exports = setupSequelizeAssociations;
