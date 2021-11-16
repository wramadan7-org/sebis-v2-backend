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

module.exports = {
  addReferralHistory,
};
