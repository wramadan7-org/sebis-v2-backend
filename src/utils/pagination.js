/**
 * Create pagination setting, used by getPagingData fn
 * @param {number} page
 * @param {number} perPage
 * @returns {Object}
 */
const getPagination = (page, perPage) => {
  const limitMax = 50;
  let limit;
  limit = (perPage && perPage > 0) ? +perPage : 10;
  if (limit > limitMax) limit = limitMax; // force maximum limit
  const offset = (page && page > 0) ? (+page - 1) * limit : 0;

  return { limit, offset };
};

/**
 * Create pagination object
 * @param {Object} data
 * @param {number} page
 * @param {number} perPage
 * @returns {Object}
 */
const getPagingData = (data, page, perPage) => {
  const { count: totalItems, rows: items } = data;
  const totalPages = Math.ceil(totalItems / +perPage);
  const itemsPerPageMax = 50;
  const itemsPerPage = (perPage && perPage > 0) ? (+perPage <= itemsPerPageMax) ? +perPage : itemsPerPageMax : 10;
  const currentPage = (page && page > 0) ? +page : 1;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = (page && currentPage < totalPages) ? currentPage + 1 : null;

  return {
    itemsPerPage, currentPage, previousPage, nextPage, totalPages, totalItems, items,
  };
};

module.exports = {
  getPagination,
  getPagingData,
};
