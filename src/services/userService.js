const httpStatus = require('http-status');
const { User } = require('../models/User');
const ApiError = require('../utils/ApiError');
const Joi = require('joi');

const createUser = async (userBody) => {
  const userSchema = Joi.object({
    email: Joi.string().email().max(32).required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().max(12).required(),
    lastName: Joi.string().max(32).required(),
  });

  const { error } = userSchema.validate(userBody);

  if (error) throw new ApiError(httpStatus.BAD_REQUEST, error);

  const user = await User.findOne({
    where: {
      email: userBody.email,
    }
  });

  if (user !== null && user.email === userBody.email) throw new ApiError(httpStatus.CONFLICT, 'Email already taken.');

  return User.create(userBody);
};

const getUserByEmail = async (email) => {
  return User.findOne({
    where: {
      email,
    }
  });
};

const updateUserById = async (userId, userBody) => {
  const user = await User.findByPk(userId);

  if (user === null) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  Object.assign(user, userBody);
  await user.save();

  return user;
};

const deleteUserById = async (userId) => {
  const user = await User.findByPk(userId);

  if (user === null) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');

  await user.destroy();

  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
