const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TopupCoin } = require('../models/TopupCoin');

const { DONE } = process.env;

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

const topup = async (userId, topupBody) => {
  const data = {
    userId,
    ...topupBody,
  };

  const topupCoin = await TopupCoin.create(data);

  return topupCoin;
};

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
