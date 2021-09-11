const { redisClient } = require('../config/redis');

const setObject = (key, object) => new Promise((resolve, reject) => {
  redisClient.hmset(key, object, (error, data) => {
    if (error) reject(error);
    resolve(data);
  });
});

const setExpire = (key, expires = 0) => {
  redisClient.expire(key, expires);
};

module.exports = {
  setObject,
  setExpire,
};