const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TopupCoin } = require('../models/TopupCoin');

const { DONE } = process.env;

/**
 * Check topup with price 100.000
 * @param {string} userId
 * @returns boolean
 */
const firstTopupCoin = async (userId) => {
  const topupCoin = await TopupCoin.findOne(
    {
      where: {
        userId,
        price: 100000,
        statusCoin: DONE,
      },
    },
  );

  if (!topupCoin) return false;

  return true;
};

/**
 * Get data topup by id
 * @param {string} id
 * @param {object} opts
 * @returns object
 */
const topupById = async (id, opts = {}) => {
  const topup = await TopupCoin.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return topup;
};

/**
 * Create data topup and send link snap to process checkout/payment
 * @param {string} userId
 * @param {object} topupBody
 * @returns object
 */
const topup = async (userId, topupBody) => {
  const data = {
    userId,
    ...topupBody,
  };

  const topupCoin = await TopupCoin.create(data);

  return topupCoin;
};

/**
 * Update status topup
 * @param {string} id
 * @param {string} status
 * @returns object
 */
const updateStatusTopUp = async (id, status) => {
  const topupCoin = await topupById(id);

  if (!topupCoin) throw new ApiError(httpStatus.NOT_FOUND, 'Topup tidak ditemukan.');

  const data = {
    statusCoin: status,
  };

  Object.assign(topupCoin, data);

  return topupCoin;
};

module.exports = {
  firstTopupCoin,
  topup,
  topupById,
  updateStatusTopUp,
};
