const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const referralHistoryService = require('../services/referralHistoryService');
const ApiError = require('../utils/ApiError');

const addReferralHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const {
    referredBy,
    referralCode,
  } = req.body;

  const referralHistory = await referralHistoryService.createReferralHistory(
    userId,
    referredBy,
    referralCode,
  );

  return referralHistory;
});

const getReferralHistories = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const referralHistories = await referralHistoryService.getReferralHistoryAll(userId);

  return referralHistories;
});

const getReferralHistoryById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { referralHistoryId } = req.params;

  const referralHistory = await referralHistoryService.getReferralHistoryById(
    referralHistoryId,
    userId,
  );

  if (!referralHistory) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  return referralHistory;
});

module.exports = {
  addReferralHistory,
  getReferralHistories,
  getReferralHistoryById,
};
