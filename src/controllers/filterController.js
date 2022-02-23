const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const curriculumService = require('../services/curriculumService');
const filterService = require('../services/filterService');

const filterLes = catchAsync(async (req, res) => {
  const { curriculum } = req.body;

  const checkCurriculum = await curriculumService.getCurriculumById(curriculum);

  const filter = await filterService.filterLes(curriculum);

  res.sendWrapped(filter, httpStatus.OK);
});

module.exports = {
  filterLes,
};
