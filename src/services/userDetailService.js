const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { UserDetail } = require('../models/UserDetail');

/**
 * Create user detail
 * @param {object} userDetailBody
 * @returns {Promise<UserDetail>}
 */
const createUserDetail = async (userDetailBody) => UserDetail.create(userDetailBody);

/**
 * Get user detail by userId
 * @param {string} userId
 * @param {object} opts
 * @returns {Promise<UserDetail | ApiError>}
 */
const getUserDetailByUserId = async (userId, opts = {}) => {
  const userDetail = await UserDetail.findOne(
    {
      where: {
        userId,
      },
      ...opts,
    },
  );
  if (!userDetail) throw new ApiError(httpStatus.NOT_FOUND, 'User detail not found.');
  return userDetail;
};

/**
 * Update user detail by userId
 * @param {string} userId
 * @param {object} userDetailBody
 * @returns {Promise<UserDetail | ApiError>}
 */
const updateUserDetailByUserId = async (userId, userDetailBody) => {
  const userDetail = await getUserDetailByUserId(userId);

  Object.assign(userDetail, userDetailBody);
  await userDetail.save();

  return userDetail;
};

/**
 * Delete user detail by userId
 * @param {string} userId
 * @returns {Promise<UserDetail | ApiError>}
 */
const deleteUserDetailById = async (userId) => {
  const userDetail = await getUserDetailByUserId(userId);

  await userDetail.destroy();

  return userDetail;
};

module.exports = {
  createUserDetail,
  getUserDetailByUserId,
  updateUserDetailByUserId,
  deleteUserDetailById,
};
