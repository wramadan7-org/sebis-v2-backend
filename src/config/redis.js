const redis = require('redis');

const redisClient = redis.createClient();

const redisTokenKey = (userId, type) => `user:jwt:${type}:${userId}`;
const redisRefreshTokenKey = 'user:jwt:refresh';
const redisUserLoginKey = 'user:login';

module.exports = {
  redisClient,
  redisTokenKey,
  redisRefreshTokenKey,
  redisUserLoginKey,
};
