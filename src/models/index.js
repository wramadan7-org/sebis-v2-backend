const { User } = require('./User');
const { School } = require('./School');

const setupSequelizeAssociations = () => {
  User.belongsTo(School);
  School.hasMany(User);
};

module.exports = setupSequelizeAssociations;
