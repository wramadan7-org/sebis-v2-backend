const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const userDetailService = require('../services/userDetailService');
const ApiError = require('../utils/ApiError');

const currentProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getUserById(userId, { opts: { include: ['school'] } });
  res.sendWrapped(user, httpStatus.OK);
});

const createUserDetail = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const priceId = req.body;
  const userDetail = await userDetailService.createUserDetail(userId, priceId);

  if (!userDetail) throw new ApiError(httpStatus.CONFLICT, 'Gagal membuat detail profile');

  res.sendWrapped(userDetail, httpStatus.CREATED);
});

module.exports = {
  currentProfile,
  createUserDetail,
};
