/* eslint-disable prefer-spread */
const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { Role } = require('../models/Role');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { TeacherSubject } = require('../models/TeacherSubject');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Price } = require('../models/Price');

const availabilityHoursService = require('./availabilityHoursService');

const nameDay = require('../utils/day');
const pagination = require('../utils/pagination');

const homePublic = async () => {
  const teacherRole = await Role.findOne(
    {
      where: {
        roleName: 'teacher',
      },
    },
  );

  const users = await User.findAll(
    {
      where: {
        roleId: teacherRole.id,
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: UserDetail,
          include: {
            model: Price,
          },
        },
        {
          model: TeacherSubject,
          include: [
            {
              model: Grade,
            },
            {
              model: Subject,
            },
          ],
        },
      ],
    },
  );

  return users;
};

const timeAvailabilityPublic = async (teacherId, month, year, page, limit, opts = {}) => {
  const user = await User.findOne(
    {
      where: {
        id: teacherId,
      },
      attributes: {
        exclude: 'password',
      },
      ...opts,
    },
  );

  let privatePrice = 0;
  let groupPrice = 0;

  if (user.userDetail && user.userDetail.price) {
    privatePrice = user.userDetail.price.private;
    groupPrice = user.userDetail.price.group;
  } else {
    const defaultPrice = await Price.findOne(
      {
        where: {
          type: 'A',
        },
      },
    );

    privatePrice = defaultPrice.private;
    groupPrice = defaultPrice.group;
  }

  const arrayAvailabilityHours = [];

  let dayInMonth = moment(`${year}-${month}`).daysInMonth();

  while (dayInMonth) {
    const date = moment().date(dayInMonth).format('YYYY-MM-DD');
    const day = moment().date(dayInMonth).days();
    const namingDay = nameDay(day);

    const findDay = await AvailabilityHours.findAll(
      {
        where: {
          dayCode: day,
          teacherId,
        },
      },
    );

    if (findDay && findDay.length > 0) {
      const mapFindDay = findDay.map((o) => {
        const data = {
          date: `${namingDay}, ${date}`,
          ...o.dataValues,
          private: privatePrice,
          group: groupPrice,
          dateSort: date,
        };

        return data;
      });

      arrayAvailabilityHours.push(mapFindDay);
    }

    dayInMonth--;
  }

  const results = [].concat(...arrayAvailabilityHours);

  results.sort((a, b) => new Date(a.dateSort) - new Date(b.dateSort));

  const paginating = pagination(results, page, limit);

  return { user, ...paginating };
};

module.exports = {
  homePublic,
  timeAvailabilityPublic,
};
