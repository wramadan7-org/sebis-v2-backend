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

const getReferralHistoryAll = async (userId) => {
  const referralHistory = await ReferralHistory.findAll(
    {
      where: {
        userId,
      },
    },
  );

  if (referralHistory.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t have referral history');

  return referralHistory;
};

const getReferralHistoryById = async (id, userId) => {
  const referralHistory = await ReferralHistory.findOne(
    {
      where: {
        id,
        userId,
      },
    },
  );

  return referralHistory;
};

const updateReferralHistory = async (id, userId, data) => {
  const referralHistory = await getReferralHistoryById(id, userId);

  if (!referralHistory) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  Object.assign(referralHistory, data);

  referralHistory.save();

  return referralHistory;
};

module.exports = {
  createReferralHistory,
  getReferralHistoryAll,
  getReferralHistoryById,
  updateReferralHistory,
};
