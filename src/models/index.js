const { User } = require('./User');
const { School } = require('./School');
const { Role } = require("./Role");

const setupSequelizeAssociations = () => {
  User.belongsTo(School);
  School.hasMany(User);
  User.belongsTo(Role);
  Role.hasMany(User);
};

module.exports = setupSequelizeAssociations;
