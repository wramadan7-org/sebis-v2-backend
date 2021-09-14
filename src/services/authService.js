const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const userService = require('./userService');
const ApiError = require('../utils/ApiError');
const redis = require('../utils/redis');
const { redisRefreshTokenKey } = require('../config/redis');

const loginWithIdentityAndPassword = async (identity, password) => {
  const user = await userService.getUserByEmail(identity);
  if (!user || !await bcrypt.compare(password, user.password)) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid identity combination.');
  return user;
};

const refreshAuth = async (refreshToken) => {
  const tokenData = await redis.getObject(`${redisRefreshTokenKey}:${refreshToken}`);
  if (!tokenData || tokenData.blacklist !== 'false') throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not valid.');
  return tokenData;
};

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
