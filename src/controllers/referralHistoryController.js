const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const referralHistoryService = require('../services/referralHistoryService');
const ApiError = require('../utils/ApiError');
const { User } = require('../models/User');

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

  res.sendWrapped(referralHistory, httpStatus.CREATED);
});

const getReferralHistories = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const referralHistories = await referralHistoryService.getReferralHistoryAll(
    userId,
    {
      include: [
        {
          model: User,
          foreignKey: 'userId',
          as: 'referencedTo',
        },
        {
          model: User,
          foreignKey: 'referredBy',
          as: 'referencedBy',
        },
      ],
    },
  );

  res.sendWrapped(referralHistories, httpStatus.OK);
});

const getReferralHistoryById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { referralHistoryId } = req.params;

  const referralHistory = await referralHistoryService.getReferralHistoryById(
    referralHistoryId,
    userId,
    {
      include: [
        {
          model: User,
          foreignKey: 'userId',
          as: 'referencedTo',
        },
        {
          model: User,
          foreignKey: 'referredBy',
          as: 'referencedBy',
        },
      ],
    },
  );

  if (!referralHistory) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  res.sendWrapped(referralHistory, httpStatus.OK);
});

module.exports = {
  addReferralHistory,
  getReferralHistories,
  getReferralHistoryById,
};
