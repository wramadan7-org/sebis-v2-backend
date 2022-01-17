const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const scheduleService = require('../services/scheduleService');
const ApiError = require('../utils/ApiError');

const { User } = require('../models/User');
const { TeacherSubject } = require('../models/TeacherSubject');
const { AvailabilityHours } = require('../models/AvailabilityHours');

const createSchedule = catchAsync(async (req, res) => {
  const scheduleBody = req.body;

  const schedule = await scheduleService.createSchedule(scheduleBody);

  res.sendWrapped(schedule, httpStatus.CREATED);
});

const getSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.getSchedule(
    {
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'student',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: TeacherSubject,
        },
        {
          model: AvailabilityHours,
        },
      ],
    },
  );

  if (!schedule && schedule.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Don\'t have data schedule.');

  res.sendWrapped(schedule, httpStatus.OK);
});

const getScheduleById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const schedule = await scheduleService.getScheduleById(
    id,
    {
      include: [
        {
          model: User,
          as: 'teacher',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'student',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: TeacherSubject,
        },
        {
          model: AvailabilityHours,
        },
      ],
    },
  );

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found.');

  res.sendWrapped(schedule, httpStatus.OK);
});

const updateSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const scheduleBody = req.body;

  const schedule = await scheduleService.updateScheduleById(id, scheduleBody);

  if (!schedule) throw new ApiError(httpStatus.NOT_MODIFIED, 'Fail to update');

  res.sendWrapped(schedule, httpStatus.OK);
});

const deleteSchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const schedule = await scheduleService.deleteSchedule(id);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Fail to delete schedule');

  res.sendWrapped(schedule, httpStatus.OK);
});

module.exports = {
  createSchedule,
  getSchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
