const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ReferralHistory } = require('../models/ReferralHistory');

const createReferralHistory = async (userId, referredBy, referralCode) => {
  const dataReferralHistory = {
    userId,
    referredBy,
    referralCode,
  };

  const insertReferralHistory = await ReferralHistory.create(dataReferralHistory);

  return insertReferralHistory;
};

module.exports = {
  createReferralHistory,
};
