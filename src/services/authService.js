const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const { getUserByEmail } = require('./userService');
const ApiError = require('../utils/ApiError');
const redis = require('../utils/redis');
const { redisRefreshTokenKey } = require('../config/redis');

const loginWithIdentityAndPassword = async (identity, password) => {
  const user = await getUserByEmail(identity);
  if (user === null || !await bcrypt.compare(password, user.password)) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid identity combination.');
  return user;
};

const refreshAuth = async (refreshToken) => {
  const tokenData = await redis.getObject(`${redisRefreshTokenKey}:${refreshToken}`);
  if (!tokenData || tokenData.blacklist !== 'false') throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not valid.');
  return tokenData;
};

module.exports = {
  loginWithIdentityAndPassword,
  refreshAuth,
};
