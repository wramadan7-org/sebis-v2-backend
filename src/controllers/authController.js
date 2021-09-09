const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { createUser, getUserByEmail, validatePassword } = require('../services/userService');
const {generateAuthTokens} = require("../services/tokenService");

const register = catchAsync(async (req, res) => {
  const userBody = req.body;
  const user = await createUser(userBody);
  res.sendWrapped(user, httpStatus.CREATED);
});

const login = catchAsync(async (req, res) => {
  const { identity, password } = req.body;
  const user = await getUserByEmail(identity);

  if (user) await validatePassword(user, password);

  const token = await generateAuthTokens(user);
  res.sendWrapped(token, httpStatus.OK);
});

module.exports = {
  login,
  register,
};
