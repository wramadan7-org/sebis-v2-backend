const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TeachingExperience } = require('../models/TeachingExperience');
const { TeachingExperienceDetail } = require('../models/TeachingExperienceDetail');

const createTeachingExperienceDetail = async (teachingExperienceId, teachingBody) => {
  const dataTeachingDetail = {
    teachingExperienceId,
    ...teachingBody,
  };

  const createdTeachingExperienceDetail = await TeachingExperienceDetail.create(dataTeachingDetail);
  return createdTeachingExperienceDetail;
};

const createTeachingExperience = async (teacherId, teachingBody, teachingDetailBody) => {
  const dataTeaching = {
    teacherId,
    ...teachingBody,
  };

  const teachingExperience = await TeachingExperience.create(dataTeaching);
  const teachingExperienceDetail = await createTeachingExperienceDetail(teachingExperience.id, teachingDetailBody);
  return { teachingExperience, teachingExperienceDetail };
};

module.exports = {
  createTeachingExperience,
  createTeachingExperienceDetail,
};
