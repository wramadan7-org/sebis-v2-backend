const httpStatus = require('http-status');
const { User } = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Create user
 * @param {object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const user = await User.findOne({
    where: {
      email: userBody.email,
    },
  });

  if (user && user.email === userBody.email) throw new ApiError(httpStatus.CONFLICT, 'Email already taken.');

  return User.create(userBody);
};

/**
 * Get user by email
 * @param {string} email
 * @param {object} opts
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email, opts = {}) => User.findOne({
  where: {
    email,
  },
  ...opts,
});

/**
 * Get user by id
 * @param {string} userId
 * @param {object} opts
 * @returns {Promise<User | ApiError>}
 */
const getUserById = async (userId, opts = {}) => {
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

/**
 * Update user by id
 * @param {string} userId
 * @param {object} userBody
 * @returns {Promise<User | ApiError>}
 */
const updateUserById = async (userId, userBody) => {
  const user = await getUserById(userId);

  Object.assign(user, userBody);
  await user.save();

  return user;
};

const updateProfile = async (userId, file) => {
  const user = await getUserById(userId);

  const data = {
    profile: file,
  };

  Object.assign(user, data);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<User | ApiError>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  await user.destroy();

  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  updateProfile,
  deleteUserById,
};
