const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const availabilityHoursService = require('../services/availabilityHoursService');

const createTutorScheduleTime = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const {
    dayCode,
    timeStart,
  } = req.body;

  const aHoursLater = moment(`1990-01-01 ${timeStart}`).add(1, 'hours').format('HH:mm');

  const data = {
    teacherId: userId,
    dayCode,
    timeStart,
    timeEnd: aHoursLater,
  };

  const creatingTutorScheduleTime = await availabilityHoursService.createTutorScheduleTime(data);

  res.sendWrapped(creatingTutorScheduleTime, httpStatus.CREATED);
});

const getTutorScheduleTimeById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { availabilityHoursId } = req.params;

  const availabilityHours = await availabilityHoursService.getTutorScheduleTimeById(availabilityHoursId, userId);

  if (!availabilityHours) throw new ApiError(httpStatus.NOT_FOUND, 'Availability hours not found.');

  res.sendWrapped(availabilityHours, httpStatus.OK);
});

const getTutorScheduleTimeAll = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const availabilityHours = await availabilityHoursService.getTutorScheduleTimes(userId);

  if (availabilityHours.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You dont have availability hours');

  res.sendWrapped(availabilityHours, httpStatus.OK);
});

const updateTutorScheduleTime = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { availabilityHoursId } = req.params;
  const availabilityHoursBody = req.body;

  const updating = await availabilityHoursService.updatingTutorScheduleTime(
    userId,
    availabilityHoursId,
    availabilityHoursBody,
  );

  res.sendWrapped(updating, httpStatus.OK);
});

module.exports = {
  createTutorScheduleTime,
  getTutorScheduleTimeAll,
  getTutorScheduleTimeById,
  updateTutorScheduleTime,
};
