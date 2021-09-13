/**
 * Create pagination setting, used by getPagingData fn
 * @param {number} page
 * @param {number} size
 * @returns {Object}
 */
const getPagination = (page, size) => {
  const limitMax = 50;
  let limit;
  limit = (size && size > 0) ? +size : 10;
  if (limit > limitMax) limit = limitMax; // force maximum limit
  const offset = (page && page > 0) ? (+page - 1) * limit : 0;

  return { limit, offset };
};

/**
 * Create pagination object
 * @param {Object} data
 * @param {number} page
 * @param {number} limit
 * @returns {Object}
 */
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = (page && page > 0) ? +page : 1;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = (page && currentPage < totalPages) ? currentPage + 1 : null;

  return {
    limit, currentPage, previousPage, nextPage, totalPages, totalItems, items,
  };
};

module.exports = {
  getPagination,
  getPagingData,
};
