const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const userService = require('./userService');
const ApiError = require('../utils/ApiError');
const redis = require('../utils/redis');
const { redisRefreshTokenKey } = require('../config/redis');

/**
 * Login with identity and password
 * @param {string} identity
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginWithIdentityAndPassword = async (identity, password) => {
  const user = await userService.getUserByEmail(identity);
  if (!user || !await bcrypt.compare(password, user.password)) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid identity combination.');
  return user;
};

/**
 * Refresh token auth
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  const tokenData = await redis.getObject(`${redisRefreshTokenKey}:${refreshToken}`);
  if (!tokenData || tokenData.blacklist !== 'false') throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not valid.');
  return tokenData;
};

/**
 *
 * @param userId
 * @param newPassword
 * @returns {Promise<User | ApiError>}
 */
const updatePassword = async (userId, newPassword) => {
  const salt = await bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(newPassword, salt);
  return userService.updateUserById(userId, { password });
};

module.exports = {
  loginWithIdentityAndPassword,
  refreshAuth,
  updatePassword,
};
