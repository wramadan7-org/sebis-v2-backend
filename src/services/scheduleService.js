const httpStatus = require('http-status');
const moment = require('moment');
const { Schedule } = require('../models/Schedule');
const ApiError = require('../utils/ApiError');

/**
 *
 * @param {object} scheduleBody
 * @returns object || error
 */
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

const getSchedule = async (opts = {}) => {
  const schedule = await Schedule.findAll(
    {
      ...opts,
    },
  );

  return schedule;
};

const getScheduleById = async (id, opts = {}) => {
  const schedule = await Schedule.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return schedule;
};

module.exports = {
  createSchedule,
  getSchedule,
  getScheduleById,
};
