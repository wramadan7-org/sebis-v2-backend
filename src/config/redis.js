const redis = require('redis');
const redisClient = redis.createClient();

const redisTokenKey = (userId, type) => `user:jwt:${type}:${userId}`;
const redisRefreshTokenKey = 'user:jwt:refresh';

module.exports = {
  redisClient,
  redisTokenKey,
  redisRefreshTokenKey,
};
