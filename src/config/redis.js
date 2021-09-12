const redis = require('redis');
const { redis: redisConfiguration } = require('./config');

const {
  protocol, host, port, user, password,
} = redisConfiguration;

const redisClient = redis.createClient(`${protocol}://${user}:${password}@${host}:${port}`);

const redisTokenKey = (userId, type) => `user:jwt:${type}:${userId}`;
const redisRefreshTokenKey = 'user:jwt:refresh';
const redisUserLoginKey = 'user:login';

module.exports = {
  redisClient,
  redisTokenKey,
  redisRefreshTokenKey,
  redisUserLoginKey,
};
