const httpStatus = require('http-status');
const { Curriculum } = require('../models/Curriculum');
const ApiError = require('../utils/ApiError');

/**
 * Create new curriculum
 * @param {Object} curriculumBody
 * @return {Promise<void | Curriculum>}
 */
const createCurriculum = async (curriculumBody) => Curriculum.create(curriculumBody);

/**
 * Get curriculum by ID
 * @param {string} curriculumId
 * @return {Promise<ApiError | Curriculum>}
 */
const getCurriculumById = async (curriculumId) => {
  const curriculum = await Curriculum.findByPk(curriculumId);
  if (!curriculum) throw new ApiError(httpStatus.NOT_FOUND, 'Curriculum not found.');
  return curriculum;
};

/**
 * Get all curriculum
 * @returns {Promise<Curriculum>}
 */
const getCurriculumAll = async () => {
  const curriculum = await Curriculum.findAll();

  if (!curriculum && curriculum.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Don\'t have a curriculum yet.');

  return curriculum;
};

/**
 * Update curriculum by ID
 * @param {string} curriculumId
 * @param {Object} curriculumBody
 * @return {Promise<ApiError|Curriculum>}
 */
const updateCurriculumById = async (curriculumId, curriculumBody) => {
  const curriculum = await getCurriculumById(curriculumId);

  Object.assign(curriculum, curriculumBody);
  await curriculum.save();

  return curriculum;
};

/**
 * Delete curriculum by ID
 * @param {string} curriculumId
 * @return {Promise<ApiError|Curriculum>}
 */
const deleteCurriculumById = async (curriculumId) => {
  const curriculum = await getCurriculumById(curriculumId);

  await curriculum.destroy();

  return curriculum;
};

module.exports = {
  createCurriculum,
  getCurriculumById,
  getCurriculumAll,
  updateCurriculumById,
  deleteCurriculumById,
};
