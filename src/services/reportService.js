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
const getReportById = async (id, opts = {}) => {
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

const updateReport = async (id, reportData, reportBody) => {
  Object.assign(reportData, reportBody);
  reportData.save();

  return reportData;
};

module.exports = {
  getAllReport,
  getReportById,
  updateReport,
};
