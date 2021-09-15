const httpStatus = require('http-status');
const { roleTypes } = require('../config/roles');
const ApiError = require('../utils/ApiError');

const teacher = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.TEACHER) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const student = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.STUDENT) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

module.exports = {
  teacher,
  student,
};
