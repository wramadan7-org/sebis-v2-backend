const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { AvailabilityHours } = require('../models/AvailabilityHours');

/**
 *
 * @param {string} teacherId;
 * @param {number} dayCode;
 * @param {string} timeStart;
 * @returns {object};
 */
const getTutorScheduleTime = async (teacherId, dayCode, timeStart) => {
  const availabilityHours = await AvailabilityHours.findOne(
    {
      where: {
        teacherId,
        dayCode,
        timeStart,
      },
    },
  );

  return availabilityHours;
};

/**
 *
 * @param {string} teacherId;
 * @param {number} dayCode;
 * @returns {array};
 */
const getTutorScheduleTimeByDay = async (teacherId, dayCode) => {
  const availabilityHours = await AvailabilityHours.findAll(
    {
      where: {
        teacherId,
        dayCode,
      },
    },
  );

  return availabilityHours;
};

/**
 * Get All Availability
 * @param {string} teacherId
 * @returns {array}
 */
const getTutorScheduleTimes = async (teacherId) => {
  const availabilityHours = await AvailabilityHours.findAll(
    {
      where: {
        teacherId,
      },
    },
  );

  return availabilityHours;
};

/**
 * Get availability hours by id
 * @param {string} availabilityHoursId;
 * @param {string} teacherId;
 * @returns {object};
 */
const getTutorScheduleTimeById = async (availabilityHoursId, teacherId) => {
  const availabilityHours = await AvailabilityHours.findOne(
    {
      where: {
        id: availabilityHoursId,
        teacherId,
      },
    },
  );

  return availabilityHours;
};

/**
 * Check for conflicted hours
 * @param {string} teacherId;
 * @param {number} dayCode;
 * @param {string} timeStart;
 * @param {string} timeEnd;
 * @param {string | optional} availabilityHoursId
 * @param {object<{offsetStart: number, offsetEnd: number}>} options;
 * @returns {boolean};
 */
const isHoursAvailable = async (teacherId, dayCode, timeStart, timeEnd, availabilityHoursId, options = { offsetStart: -15, offsetEnd: 15 }) => {
  let availablityHours;
  availablityHours = await getTutorScheduleTimeByDay(teacherId, dayCode);

  if (availabilityHoursId) {
    const availablityHoursAnother = await AvailabilityHours.findAll(
      {
        teacherId,
        dayCode,
        id: {
          [Op.ne]: availabilityHoursId,
        },
      },
    );

    availablityHours = availablityHoursAnother;
  }

  if (availablityHours.length <= 0) {
    return true;
  }

  const originalLength = availablityHours.slice().length;

  const currentDate = moment().format('YYYY-MM-DD');
  const inputTimeStart = moment(`${currentDate} ${timeStart}`);
  const inputTimeEnd = moment(`${currentDate} ${timeEnd}`);

  availablityHours = availablityHours.filter((availabiltyHour) => {
    const recordTimeStart = moment(`${currentDate} ${availabiltyHour.timeStart}`).add(options.offsetStart, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const recordTimeEnd = moment(`${currentDate} ${availabiltyHour.timeEnd}`).add(options.offsetEnd, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    return !inputTimeStart.isBetween(recordTimeStart, recordTimeEnd) && !inputTimeEnd.isBetween(recordTimeStart, recordTimeEnd);
  });

  return originalLength === availablityHours.length;
};

/**
 * Creating availability hours
 * @param {object={dayCode: number, timeStart: string}} data;
 * @returns {object};
 */
const createTutorScheduleTime = async (data) => {
  const {
    teacherId,
    dayCode,
    timeStart,
    timeEnd,
  } = data;

  const checkSameScheduleTime = await getTutorScheduleTime(teacherId, dayCode, timeStart);
  if (checkSameScheduleTime) throw new ApiError(httpStatus.CONFLICT, 'You have the same schedule time.');

  const valid = await isHoursAvailable(teacherId, dayCode, timeStart, timeEnd);

  if (!valid) throw new ApiError(httpStatus.CONFLICT, 'Schedule is already');

  await AvailabilityHours.create(data);

  return valid;
};

/**
 * Updating availability hours
 * @param {string} userId;
 * @param {string} availabilityHoursId;
 * @param {object} body;
 * @returns {object};
 */
const updatingTutorScheduleTime = async (userId, availabilityHoursId, body) => {
  const defaultDate = '1990-01-01';
  const availabilityHours = await getTutorScheduleTimeById(availabilityHoursId, userId);

  if (!availabilityHours) throw new ApiError(httpStatus.NOT_FOUND, 'Availability hours not found.');

  Object.assign(availabilityHours, body);

  availabilityHours.timeEnd = moment(`${defaultDate} ${availabilityHours.timeStart}`).add(1, 'hours').format('HH:mm');

  const valid = await isHoursAvailable(
    userId,
    availabilityHours.dayCode,
    availabilityHours.timeStart,
    availabilityHours.timeEnd,
    availabilityHoursId,
  );

  if (!valid) throw new ApiError(httpStatus.CONFLICT, 'Schedule is already');

  availabilityHours.save();

  return availabilityHours;
};

/**
 * Deleting availability hours;
 * @param {string} userId;
 * @param {string} availabilityHoursId;
 * @returns {object};
 */
const deletingTutorScheduleTime = async (userId, availabilityHoursId) => {
  const availabilityHours = await getTutorScheduleTimeById(availabilityHoursId, userId);

  if (!availabilityHours) throw new ApiError(httpStatus.NOT_FOUND, 'Availability hours not found.');

  await availabilityHours.destroy();
  return availabilityHours;
};

module.exports = {
  getTutorScheduleTime,
  getTutorScheduleTimeById,
  getTutorScheduleTimes,
  createTutorScheduleTime,
  updatingTutorScheduleTime,
  deletingTutorScheduleTime,
};
