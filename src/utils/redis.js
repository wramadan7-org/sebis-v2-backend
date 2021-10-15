const { redisClient } = require('../config/redis');

/**
 * Set redis string data
 * @param {string} key
 * @param {string} value
 * @return {Promise<unknown>}
 */
const setString = (key, value) => new Promise((resolve, reject) => {
  redisClient.set(key, value, (error, data) => {
    if (error) reject(error);
    resolve(data);
  });
});

/**
 * Get redis string data
 * @param {string} key
 * @return {Promise<any>}
 */
const getString = (key) => new Promise((resolve, reject) => {
  redisClient.get(key, (error, data) => {
    if (error) reject(error);
    resolve(data);
  });
});

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
const delKey = (key) => {
  redisClient.del(key);
};

/**
 *
 * @param {string} key
 * @param {promise} promise
 * @return {Promise<object>}
 */
const getData = async (key, promise) => {
  let data;
  let isCached = false;

  const result = await getString(key);

  if (!result) {
    data = await promise;
    await setString(key, JSON.stringify(data));
  } else {
    isCached = true;
    data = JSON.parse(result);
  }

  return {
    data,
    isCached,
  };
};

module.exports = {
  setString,
  getString,
  setObject,
  getObject,
  setExpire,
  delKey,
  getData,
};
