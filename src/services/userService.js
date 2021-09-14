const httpStatus = require('http-status');
const { User } = require('../models/User');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  const user = await User.findOne({
    where: {
      email: userBody.email,
    },
  });

  if (user && user.email === userBody.email) throw new ApiError(httpStatus.CONFLICT, 'Email already taken.');

  return User.create(userBody);
};

const getUserByEmail = async (email) => User.findOne({
  where: {
    email,
  },
});

const getUserById = async (userId, { opts = {} } = {}) => {
  const user = await User.findOne(
    {
      where: {
        id: userId,
      },
      ...opts,
    },
  );
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
  return user;
};

const updateUserById = async (userId, userBody) => {
  const user = await User.findByPk(userId);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  Object.assign(user, userBody);
  await user.save();

  return user;
};

const deleteUserById = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  await user.destroy();

  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
};
