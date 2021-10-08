const { User } = require('./User');
const { School } = require('./School');
const { Role } = require('./Role');
const { Cart } = require('./Cart');

const setupSequelizeAssociations = () => {
  User.belongsTo(Role);
  User.belongsTo(School);
  User.hasOne(Cart, {
    foreignKey: 'studentId',
  });

  School.hasMany(User);

  Role.hasMany(User);

  Cart.belongsTo(User, {
    foreignKey: 'id',
  });
};

module.exports = setupSequelizeAssociations;
