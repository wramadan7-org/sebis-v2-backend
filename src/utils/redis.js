const { redisClient } = require('../config/redis');

/**
 * Set redis map data
 * @param {string} key
 * @param {Object} object
 * @returns {Promise<Object>}
 */
const setObject = (key, object) => new Promise((resolve, reject) => {
  redisClient.hmset(key, object, (error, data) => {
    if (error) reject(error);
    resolve(data);
  });
});

/**
 * Get redis map data
 * @param {string} key
 * @returns {Promise<Object>}
 */
const getObject = (key) => new Promise((resolve, reject) => {
  redisClient.hgetall(key, (error, data) => {
    if (error) reject(error);
    resolve(data);
  });
});

/**
 * Set redis expires
 * @param {string} key
 * @param {number} expires
 * @returns {void}
 */
const setExpire = (key, expires = 0) => {
  redisClient.expire(key, expires);
};

/**
 * Remove redis record
 * @param {string} key
 * @returns {void}
 */
const delKey =(key) => {
  redisClient.del(key);
}

module.exports = {
  setObject,
  getObject,
  setExpire,
  delKey,
};
