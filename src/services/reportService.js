const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Report } = require('../models/Reports');

/**
 * Get all data report
 * @param {object} opts
 * @returns array
 */
const getAllReport = async (opts = {}) => Report.findAll({ ...opts });

/**
 * Get detail report
 * @param {string} id
 * @param {object} opts
 * @returns object
 */
const getReportDetail = async (id, opts = {}) => {
  const report = await Report.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return report;
};

module.exports = {
  getAllReport,
  getReportDetail,
};
