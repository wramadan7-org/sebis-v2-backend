const httpStatus = require('http-status');
const { EducationBackground } = require('../models/EducationBackground');
const ApiError = require('../utils/ApiError');

const createEducationBackground = async (teacherId, educationBody) => {
  const data = {
    teacherId,
    ...educationBody,
  };

  const created = await EducationBackground.create(data);
  return created;
};

module.exports = {
  createEducationBackground,
};
