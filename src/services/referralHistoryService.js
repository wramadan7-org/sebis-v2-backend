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

const getReferralHistoryAll = async () => {
  const referralHistory = await ReferralHistory.findAll();

  if (referralHistory.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t have referral history');

  return referralHistory;
};

module.exports = {
  createReferralHistory,
  getReferralHistoryAll,
};
