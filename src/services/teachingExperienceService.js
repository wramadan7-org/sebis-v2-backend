const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TeachingExperience } = require('../models/TeachingExperience');
const { TeachingExperienceDetail } = require('../models/TeachingExperienceDetail');

const createTeachingExperienceDetails = async (teachingExperienceDetails) => TeachingExperienceDetail.bulkCreate(teachingExperienceDetails);

const createTeachingExperience = async (teacherId, teachingBody, teachingDetailBody) => {
  const dataTeaching = {
    teacherId,
    ...teachingBody,
  };

  const teachingExperience = await TeachingExperience.create(dataTeaching);

  teachingDetailBody.map((teachingExperienceDetail) => {
    teachingExperienceDetail.teachingExperienceId = teachingExperience.id;
    return teachingExperienceDetail;
  });
  const teachingExperienceDetails = await createTeachingExperienceDetails(teachingDetailBody);
  return { teachingExperience, teachingExperienceDetails };
};

module.exports = {
  createTeachingExperience,
  createTeachingExperienceDetails,
};
