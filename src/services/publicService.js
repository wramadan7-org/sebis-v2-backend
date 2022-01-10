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

const availabilityHoursService = require('./availabilityHoursService');
const nameDay = require('../utils/day');

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

const timeAvailabilityPublic = async (teacherId, month, year) => {
  const availabilityHours = await availabilityHoursService.getTutorScheduleTimes(teacherId);

  const arrayAvailabilityHours = [];

  let dayInMonth = moment(`${year}-${month}`).daysInMonth();

  const mapDay = availabilityHours.map((o) => o.dayCode);
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
          dateSort: date,
        };

        return data;
      });

      arrayAvailabilityHours.push(mapFindDay);
    }

    dayInMonth--;
  }

  const results = [].concat(...arrayAvailabilityHours);

  results.sort((a, b) => new Date(b.dateSort) - new Date(a.dateSort));

  return results;
};

module.exports = {
  homePublic,
  timeAvailabilityPublic,
};
