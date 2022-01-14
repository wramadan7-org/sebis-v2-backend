const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const scheduleService = require('../services/scheduleService');

const createSchedule = catchAsync(async (req, res) => {
  const scheduleBody = req.body;

  const schedule = await scheduleService.createSchedule(scheduleBody);

  res.sendWrapped(schedule, httpStatus.CREATED);
});

module.exports = {
  createSchedule,
};
