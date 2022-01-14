const httpStatus = require('http-status');
const moment = require('moment');
const { Schedule } = require('../models/Schedule');
const ApiError = require('../utils/ApiError');

const createSchedule = async (scheduleBody) => {
  const dateSchedule = moment(scheduleBody.dateSchedule).format('YYYY-MM-DD');

  const data = {
    dateSchedule,
    ...scheduleBody,
  };

  const schedule = await Schedule.create(data);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Fail to create schedule, something wrong.');

  return schedule;
};

module.exports = {
  createSchedule,
};
