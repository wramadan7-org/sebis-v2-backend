const { User } = require('./User');
const { School } = require('./School');
const { Role } = require('./Role');
const { Cart } = require('./Cart');

const setupSequelizeAssociations = () => {
  User.belongsTo(Role);
  User.belongsTo(School);
  User.hasOne(Cart);

  School.hasMany(User);

  Role.hasMany(User);

  Cart.belongsTo(User);
};

module.exports = setupSequelizeAssociations;
