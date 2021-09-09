const { getUserByEmail } = require("./userService");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const validatePassword = async (user, password) => {
  const filterPassword = password === undefined ? '' : password;
  const loginValid = await bcrypt.compare(filterPassword, user.password);
  if (!loginValid) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid identity combination.');
}

const loginWithIdentityAndPassword = async (identity, password) => {
  const user = await getUserByEmail(identity);
  if (user === null) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid identity combination.');
  await validatePassword(user, password);
  return user;
};

module.exports = {
  validatePassword,
  loginWithIdentityAndPassword,
};