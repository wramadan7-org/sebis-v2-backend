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

  teachingDetailBody.forEach((teachingExperienceDetail) => {
    teachingExperienceDetail.teachingExperienceId = teachingExperience.id;
  });
  teachingDetailBody = teachingDetailBody.filter((teachingExperienceDetail) => teachingExperienceDetail.gradeCode > 0 && teachingExperienceDetail.gradeCode <= 12);

  // rollback / undo create data
  if (teachingDetailBody.length <= 0) {
    await teachingExperience.destroy();
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid input gradeCode');
  }

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
