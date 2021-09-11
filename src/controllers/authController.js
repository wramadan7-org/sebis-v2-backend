const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { createUser } = require('../services/userService');
const { loginWithIdentityAndPassword } = require('../services/authService');
const { generateAuthTokens } = require('../services/tokenService');
const { revokeToken } = require('../services/tokenService');
const { tokenTypes } = require('../config/tokens');

const register = catchAsync(async (req, res) => {
  const userBody = req.body;
  const user = await createUser(userBody);
  res.sendWrapped(user, httpStatus.CREATED);
});

const login = catchAsync(async (req, res) => {
  const { identity, password } = req.body;
  const user = await loginWithIdentityAndPassword(identity, password);
  const token = await generateAuthTokens(user);
  res.sendWrapped(token, httpStatus.OK);
});

const logout = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const userToken = req.token;
  await revokeToken(userId, tokenTypes.ACCESS, userToken);
  res.sendWrapped('Logout success.', httpStatus.OK);
});

module.exports = {
  login,
  register,
  logout,
};
