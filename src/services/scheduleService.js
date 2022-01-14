const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const { Schedule } = require('../models/Schedule');
const ApiError = require('../utils/ApiError');

const {
  PENDING, ACCEPT, PROCESS, REJECT, EXPIRE, DONE,
} = process.env;

/**
 * Cek semua jadwal les
 * @param {string} teacherId
 * @param {string} teacherSubjectId
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
        statusSchedule: {
          [Op.notIn]: [
            REJECT,
            EXPIRE,
          ],
        },
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
 * Membuat jadwal les
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

  if (checkSchedule) throw new ApiError(httpStatus.CONFLICT, 'Schedule already exist. Please order another schedule!');

  const data = {
    dateSchedule,
    ...scheduleBody,
  };

  const schedule = await Schedule.create(data);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Fail to create schedule, something wrong.');

  return schedule;
};

/**
 * Mengambil semua data jadwal les
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
 * Mengambil data jadwal les berdasarkan id
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
