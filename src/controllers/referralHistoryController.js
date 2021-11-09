const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const referralHistoryService = require('../services/referralHistoryService');
const ApiError = require('../utils/ApiError');

const addReferralHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const referralBody = req.body;
});
