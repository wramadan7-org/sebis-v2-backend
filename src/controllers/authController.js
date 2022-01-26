const httpStatus = require('http-status');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const { tokenTypes } = require('../config/tokens');
const { googleAuth } = require('../utils/googleOauth');

const register = catchAsync(async (req, res) => {
  const userBody = req.body;
  const user = await userService.createUser(userBody);
  res.sendWrapped(user, httpStatus.CREATED);
});

const loginByGoogleTeacher = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const role = '437e0221-eb3d-477f-a3b3-799256fbcab6';
  const googleUser = await googleAuth(idToken, role);
  const { access, refresh } = await tokenService.generateAuthTokens(googleUser);

  const message = 'Login Sucessfully';
  const user = {
    message,
    googleUser,
    access,
    refresh,
  };

  res.sendWrapped(user, httpStatus.OK);
});

const loginByGoogleStudent = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const role = 'a0a76676-e446-49d2-ab7a-ae622783d7b8';
  const googleUser = await googleAuth(idToken, role);
  const { access, refresh } = await tokenService.generateAuthTokens(googleUser);

  const message = 'Login Sucessfully';
  const user = {
    message,
    googleUser,
    access,
    refresh,
  };

  res.sendWrapped(user, httpStatus.OK);
});

const login = catchAsync(async (req, res) => {
  const { identity, password } = req.body;
  const user = await authService.loginWithIdentityAndPassword(
    identity,
    password,
  );
  const token = await tokenService.generateAuthTokens(user);
  res.sendWrapped(token, httpStatus.OK);
});

const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokenData = await authService.refreshAuth(refreshToken);
  const user = await userService.getUserById(tokenData.userId, {
    opts: { include: 'role' },
  });
  const token = await tokenService.generateAuthTokens(user);
  res.sendWrapped(token, httpStatus.OK);
});

const logout = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const userToken = req.token;
  tokenService.revokeToken(userId, tokenTypes.ACCESS, userToken);
  tokenService.revokeUser(userId);
  res.sendWrapped('Logout success.', httpStatus.OK);
});

const testProtected = catchAsync(async (req, res) => {
  res.sendWrapped('Access granted.', httpStatus.OK);
});

const resetPassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;
  await authService.updatePassword(userId, password);
  res.sendWrapped('Password updated.', httpStatus.OK);
});

module.exports = {
  login,
  refreshTokens,
  register,
  logout,
  testProtected,
  resetPassword,
  loginByGoogleTeacher,
  loginByGoogleStudent,
};
