const { User } = require('./User');
const { School } = require('./School');
const { Role } = require('./Role');

const setupSequelizeAssociations = () => {
  User.belongsTo(Role);
  User.belongsTo(School);

  School.hasMany(User);

  Role.hasMany(User);
};

module.exports = setupSequelizeAssociations;
