const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TeachingExperience } = require('../models/TeachingExperience');
const { TeachingExperienceDetail } = require('../models/TeachingExperienceDetail');

const getTeachingExperienceById = async (teacherId, teachingExperienceId, opts = {}) => {
  const teachingExperience = await TeachingExperience.findOne(
    {
      where: {
        id: teachingExperienceId,
        teacherId,
      },
      ...opts,
    },
  );

  return teachingExperience;
};

const getTeachingExperienceDetailById = async (teachingExperienceId, teachingExperienceDetailId) => {
  const teachingExperienceDetail = await TeachingExperienceDetail.findAll(
    {
      where: {
        id: teachingExperienceDetailId,
        teachingExperienceId,
      },
    },
  );

  return teachingExperienceDetail;
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

const updatedTeachingExperience = async (teacherId, teachingExperienceId, teachingExperienceBody, teachingExperienceDetailBody) => {
  const teachingExperience = await getTeachingExperienceById(
    teacherId,
    teachingExperienceId,
    {
      include: [
        {
          model: TeachingExperienceDetail,
        },
      ],
    },
  );

  const mapingTeachingExperienceDetail = teachingExperience.teachingExperienceDetails.map((o) => o.id);

  Object.assign(teachingExperience, teachingExperienceBody);
  teachingExperience.save();

  return teachingExperience;
};

const deletedTeachingExperience = async (teacherId, teachingExperienceId) => {
  const checkTeachingExperience = await getTeachingExperienceById(teacherId, teachingExperienceId);

  if (!checkTeachingExperience) throw new ApiError(httpStatus.NOT_FOUND, 'Teaching experience not found.');

  const teachingExperience = await checkTeachingExperience.destroy();
  return teachingExperience;
};

const deletedTeachingExperienceDetail = async (teacherId, teachingExperienceId, teachingExperienceDetailId) => {
  const teachingExperience = await getTeachingExperienceById(
    teacherId,
    teachingExperienceId,
  );

  if (!teachingExperience) throw new ApiError(httpStatus.NOT_FOUND, 'Teaching experience not found.');

  const teachingExperienceDetail = await getTeachingExperienceDetailById(
    teachingExperience.id,
    teachingExperienceDetailId,
  );

  if (!teachingExperienceDetail) throw new ApiError(httpStatus.NOT_FOUND, 'Detail teaching experience not found.');

  teachingExperienceDetail.destroy();

  return { teachingExperience, teachingExperienceDetail };
};

module.exports = {
  createTeachingExperience,
  createTeachingExperienceDetails,
  getTeachingExperienceById,
  updatedTeachingExperience,
  getTeachingExperienceDetailById,
  deletedTeachingExperience,
  deletedTeachingExperienceDetail,
};
