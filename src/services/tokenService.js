const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const redis = require('../utils/redis');

const redisTokenKey = (userId, type) => `user:jwt:${type}:${userId}`;
const redisRefreshTokenKey = 'user:jwt:refresh';

const signToken = (userId, type, token, ttl = -1) => {
  const redisKey = `${redisTokenKey(userId, type)}:${token}`;
  redis.setObject(redisKey, {
    blacklist: false,
  }).then(() => {
    if (ttl > 0) redis.setExpire(redisKey, ttl);
  });
};

const signRefreshToken = (refreshToken, ttl = -1) => {
  const redisKey = `${redisRefreshTokenKey}:${refreshToken}`;
  redis.setObject(redisKey, {
    blacklist: false,
  }).then(() => {
    if (ttl > 0) redis.setExpire(redisKey, ttl);
  });
};

const revokeToken = (userId, type, token) => {
  const redisKey = `${redisTokenKey(userId, type)}:${token}`;
  return redis.setObject(redisKey, {
    blacklist: true,
  });
};

const revokeRefreshToken = (refreshToken) => {
  const redisKey = `${redisRefreshTokenKey}:${refreshToken}`;
  return redis.setObject(redisKey, {
    blacklist: true,
  });
};

const isTokenActive = (userId, type, token) => new Promise((resolve, reject) => {
  const redisKey = `${redisTokenKey(userId, type)}:${token}`;
  redis.getObject(redisKey).then((data) => {
    resolve(data.blacklist === 'false');
  }).catch((error) => (reject(error)));
});

const isRefreshTokenActive = (refreshToken) => new Promise((resolve, reject) => {
  const redisKey = `${redisRefreshTokenKey}:${refreshToken}`;
  redis.getObject(redisKey).then((data) => {
    resolve(data.blacklist === 'false');
  }).catch((error) => (reject(error)));
});

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);

  // save token to redis
  signToken(user.id, tokenTypes.ACCESS, accessToken, accessTokenExpires.diff(moment(), 'seconds'));
  signRefreshToken(refreshToken, refreshTokenExpires.diff(moment(), 'seconds'))

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

module.exports = {
  generateAuthTokens,
  revokeToken,
  revokeRefreshToken,
  isTokenActive,
  isRefreshTokenActive,
};
