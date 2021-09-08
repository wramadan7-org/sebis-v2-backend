const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const login = catchAsync(async (req, res) => {
  const user = {
    username: 'Hello',
    password: 'Test123',
  };
  res.status(httpStatus.OK).send({ user });
});

module.exports = {
  login,
};