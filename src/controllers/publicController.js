const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const publicService = require('../services/publicService');

const publicHome = catchAsync(async (req, res) => {
  const home = await publicService.homePublic();

  if (!home) throw new ApiError(httpStatus.NOT_FOUND, 'Empty data');

  res.sendWrapped(home, httpStatus.OK);
});

const availabilityHours = catchAsync(async (req, res) => {
  const { teacherId } = req.params;
  const { month } = req.query;

  let theMonth;

  if (!month) {
    theMonth = moment().format('M');
  } else {
    theMonth = month;
  }

  const year = moment().format('YYYY');

  const availabilityHoursTutor = await publicService.timeAvailabilityPublic(teacherId, theMonth, year);

  if (!availabilityHoursTutor) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher don\'t have availability hours.');

  res.sendWrapped(availabilityHoursTutor, httpStatus.OK);
});

module.exports = {
  publicHome,
  availabilityHours,
};
