const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');

const currentProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await userService.getUserById(userId);
  res.sendWrapped(user, httpStatus.OK);
});

module.exports = {
  currentProfile,
};
