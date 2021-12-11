const bcrypt = require('bcrypt');
const {
  sequelize,
  SequelizeInstance,
  DataTypes,
} = require('../config/database');
const { generateReferralCode } = require('../utils/random');
const { genders } = require('../config/users');

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: SequelizeInstance.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      // type: DataTypes.ENUM(Object.values(genders)),
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referralCode: {
      type: DataTypes.STRING,
      defaultValue: generateReferralCode(),
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referredBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temporaryPeopleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    temporaryIdentityId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    }
  },
  {
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
    },
  },
);

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = {
  User,
};
