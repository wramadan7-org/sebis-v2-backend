const httpStatus = require('http-status');
const { Point } = require('../models/Point');
const ApiError = require('../utils/ApiError');

/**
 * Get all point
 * @return {Promise<ApiError | Point>}
 */
const getAllPoint = async () => {
  const point = await Point.findAll();
  return point;
};

/**
 * Get point by id
 * @param {string} id
 * @return {Promise<ApiError | Point>}
 */
const getPointById = async (id) => {
  const point = await Point.findOne({
    where: {
      id,
    },
  });
  return point;
};

/**
 * Get point by price
 * @param {string} price
 * @return {Promise<ApiError | Point>}
 */
const getPointByPrice = async (price) => {
  const point = await Point.findOne({
    where: {
      price,
    },
  });
  return point;
};

/**
 * Create new point
 * @param {Object} body
 * @return {Promise<void | Point>}
 */
const createPoint = async (body) => {
  const point = await Point.create(body);
  return point;
};

/**
 * Update point by id
 * @param {string} id
 * @param {Object} body
 * @return {Promise<ApiError|Point>}
 */
const updatePointById = async (id, body) => {
  const point = await getPointById(id);
  if (!point) throw new ApiError(httpStatus.NOT_FOUND, 'Point tidak ditemukan');
  Object.assign(point, body);
  point.save();
  return point;
};

/**
 * Delete point by id
 * @param {string} id
 * @return {Promise<ApiError|Point>}
 */
const deletePointById = async (id) => {
  const point = await getPointById(id);
  point.destroy();
  return point;
};

module.exports = {
  getAllPoint,
  getPointById,
  getPointByPrice,
  createPoint,
  updatePointById,
  deletePointById,
};
