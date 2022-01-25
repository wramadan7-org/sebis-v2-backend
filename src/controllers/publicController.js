const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { UserDetail } = require('../models/UserDetail');
const { Price } = require('../models/Price');

const publicService = require('../services/publicService');

const pagination = require('../utils/pagination');

const publicHome = catchAsync(async (req, res) => {
  let { page, limit } = req.query;

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  const home = await publicService.homePublic();

  if (!home || home.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'List tutor masih kosong.');

  const results = home.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginating = pagination(results, page, limit);

  // if (!paginating || paginating.data.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'List tutor masih kosong.');

  res.sendWrapped('', httpStatus.OK, paginating);
});

const availabilityHours = catchAsync(async (req, res) => {
  const { teacherId } = req.params;
  let { month, page, limit } = req.query;

  let theMonth;

  if (!month) {
    theMonth = moment().format('M');
  } else {
    theMonth = month;
  }

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const year = moment().format('YYYY');

  const availabilityHoursTutor = await publicService.timeAvailabilityPublic(
    teacherId,
    theMonth,
    year,
    page,
    limit,
    {
      include: [
        {
          model: UserDetail,
          include: Price,
        },
      ],
    },
  );

  if (!availabilityHoursTutor) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher don\'t have availability hours.');

  res.sendWrapped('', httpStatus.OK, availabilityHoursTutor);
});

module.exports = {
  publicHome,
  availabilityHours,
};
