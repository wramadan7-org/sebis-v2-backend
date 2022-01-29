const httpStatus = require('http-status');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');
const { tokenTypes } = require('../config/tokens');
const { googleAuth } = require('../utils/googleOauth');
const { roleId } = require('../config/roles');
const ApiError = require('../utils/ApiError');
const { sendMail } = require('../utils/mailer');

const register = catchAsync(async (req, res) => {
  const userBody = req.body;
  const user = await userService.createUser(userBody);

  // let linkUri = `${baseurl}/reset-password/${randomString}`;
  let url;
  let textEmail = `Hello ${user.email}, <br>`;
  textEmail
    += 'Silahkan klik link dibawah ini untuk melakukan verifikasi pergatian password:<br>';
  textEmail += `Link Validasi: <u><b>${url}</b></u>`;
  textEmail += '<br><br><br>';
  textEmail += 'Regards,<br>';
  textEmail += 'SebisLes Staff';

  sendMail(user.email, 'SEBIS Les - User Email', textEmail);

  res.sendWrapped(user, httpStatus.CREATED);
});

const loginByPhoneNumber = catchAsync(async (req, res) => {
  // belum otp
  const { phoneNumber } = req.body;
  const user = await userService.getUserByPhoneNumber(phoneNumber, {
    include: 'role',
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Phone not registered');
  }

  const token = await tokenService.generateAuthTokens(user);
  const login = {
    user,
    token,
  };

  res.sendWrapped(login, httpStatus.OK);
});

const registerByPhoneNumber = catchAsync(async (req, res) => {
  // belum otp
  const { body } = req;
  body.roleId = roleId.STUDENT;
  const user = await userService.createUserByPhoneNumber(body);
  const token = await tokenService.generateAuthTokens(user);
  const login = {
    user,
    token,
  };
  res.sendWrapped(login, httpStatus.CREATED);
});

const loginByGoogleTeacher = catchAsync(async (req, res) => {
  const { idToken } = req.body;
  const role = roleId.TEACHER;
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
  const role = roleId.STUDENT;
  const user = await googleAuth(idToken, role);
  const { access, refresh } = await tokenService.generateAuthTokens(user);

  const message = 'Login Sucessfully';
  const login = {
    message,
    user,
    access,
    refresh,
  };

  res.sendWrapped(login, httpStatus.OK);
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
  loginByPhoneNumber,
  registerByPhoneNumber,
};
