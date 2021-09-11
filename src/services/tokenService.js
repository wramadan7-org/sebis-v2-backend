const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const { redisClient } = require('../config/redis');

const redisTokenKey = (userId, type) => `user:jwt:${type}:${userId}`;

const signToken = (userId, type, token, ttl = -1) => {
  redisClient.hmset(`${redisTokenKey(userId, type)}:${token}`, {
    blacklist: false,
  });
  if (ttl > 0) redisClient.expire(`${redisTokenKey(userId, type)}:${token}`, ttl);
};

const revokeToken = (userId, type, token) => {
  redisClient.hmset(`${redisTokenKey(userId, type)}:${token}`, {
    blacklist: true,
  });
};

const isTokenActive = (userId, type, token) => new Promise((resolve, reject) => {
  redisClient.hgetall(`${redisTokenKey(userId, type)}:${token}`, (error, value) => {
    if (error) reject(error);
    resolve(value !== null && value.blacklist === 'false');
  });
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
  generateToken,
  generateAuthTokens,
  revokeToken,
  isTokenActive,
};
