const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const { getUserByEmail } = require('./userService');
const ApiError = require('../utils/ApiError');

const loginWithIdentityAndPassword = async (identity, password) => {
  const user = await getUserByEmail(identity);
  if (user === null || !await bcrypt.compare(password, user.password)) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid identity combination.');
  return user;
};

module.exports = {
  loginWithIdentityAndPassword,
};
