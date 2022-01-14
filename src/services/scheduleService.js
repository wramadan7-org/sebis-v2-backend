const httpStatus = require('http-status');
const moment = require('moment');
const { Schedule } = require('../models/Schedule');
const ApiError = require('../utils/ApiError');

const {
  PENDING, ACCEPT, REJECT, EXPIRE, DONE,
} = process.env;

/**
 * Check all schedule
 * @param {uuidv4 || string} teacherId
 * @param {uuidv4 || string} teacherSubjectId
 * @param {uuidv4 || string} availabilityHoursId
 * @returns boolean
 */
const checkerSchedule = async (teacherId, teacherSubjectId, availabilityHoursId) => {
  const schedule = await Schedule.findOne(
    {
      where: {
        teacherId,
        teacherSubjectId,
        availabilityHoursId,
      },
    },
  );

  // jika jadwal sudah ada, maka tampilkan true
  if (schedule) {
    return true;
  }

  return false;
};

/**
 *
 * @param {object} scheduleBody
 * @returns object || error
 */
const createSchedule = async (scheduleBody) => {
  const dateSchedule = moment(scheduleBody.dateSchedule).format('YYYY-MM-DD');

  // lakukan pengecekan jadwal
  const checkSchedule = await checkerSchedule(
    scheduleBody.teacherId,
    scheduleBody.teacherSubjectId,
    scheduleBody.availabilityHoursId,
  );

  if (checkerSchedule) throw new ApiError(httpStatus.CONFLICT, 'Schedule already exist. Please order another schedule!');

  const data = {
    dateSchedule,
    ...scheduleBody,
  };

  const schedule = await Schedule.create(data);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Fail to create schedule, something wrong.');

  return schedule;
};

/**
 *
 * @param {object} opts
 * @returns array of object
 */
const getSchedule = async (opts = {}) => {
  const schedule = await Schedule.findAll(
    {
      ...opts,
    },
  );

  return schedule;
};

/**
 *
 * @param {string} id
 * @param {object} opts
 * @returns object
 */
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
  checkerSchedule,
  createSchedule,
  getSchedule,
  getScheduleById,
};
