const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TeachingExperience } = require('../models/TeachingExperience');
const { TeachingExperienceDetail } = require('../models/TeachingExperienceDetail');

const getTeachingExperienceById = async (teacherId, teachingExperienceId) => {
  const teachingExperience = await TeachingExperience.findOne(
    {
      where: {
        id: teachingExperienceId,
        teacherId,
      },
    },
  );

  return teachingExperience;
};

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

const deletedTeachingExperience = async (teacherId, teachingExperienceId) => {
  const checkTeachingExperience = await getTeachingExperienceById(teacherId, teachingExperienceId);

  if (!checkTeachingExperience) throw new ApiError(httpStatus.NOT_FOUND, 'Teaching experience not found.');

  const teachingExperience = await checkTeachingExperience.destroy();
  return teachingExperience;
};

module.exports = {
  createTeachingExperience,
  createTeachingExperienceDetails,
  getTeachingExperienceById,
  deletedTeachingExperience,
};
