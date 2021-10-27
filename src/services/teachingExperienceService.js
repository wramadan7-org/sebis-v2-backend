const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TeachingExperience } = require('../models/TeachingExperience');

const createTeachingExperience = async (teacherId, teachingBody) => {
  const dataTeaching = {
    teacherId,
    ...teachingBody,
  };

  await TeachingExperience.create(dataTeaching);
  return dataTeaching;
};

const createTeachingExperienceDetail = async (teacherId, teachingId, teachingBody) => {
  const dataTeachingDetail = {
    teacherId,
    teachingId,
    ...teachingBody,
  };
};

module.exports = {
  createTeachingExperience,
  createTeachingExperienceDetail,
};
