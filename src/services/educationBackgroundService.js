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

const getEducationBackground = async (teacherId) => {
  const eduBackground = await EducationBackground.findAll(
    {
      where: {
        teacherId,
      },
    },
  );

  if (!eduBackground && eduBackground.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t have education background');

  return eduBackground;
};

module.exports = {
  createEducationBackground,
  getEducationBackground,
};
