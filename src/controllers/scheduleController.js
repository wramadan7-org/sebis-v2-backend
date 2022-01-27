const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const scheduleService = require('../services/scheduleService');
const cartService = require('../services/cartService');
const userService = require('../services/userService');
const userDetailService = require('../services/userDetailService');
const priceService = require('../services/priceService');
const ApiError = require('../utils/ApiError');

const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { Cart } = require('../models/Cart');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Price } = require('../models/Price');

const paginator = require('../utils/pagination');
const dates = require('../utils/date');
const days = require('../utils/day');

const createSchedule = catchAsync(async (req, res) => {
  const { id } = req.user;
  const scheduleBody = req.body;

  if (scheduleBody.length <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Masukkan data dengan benar.');

  const user = await userService.getUserById(id);

  const arrayDataBody = [];
  let subtotal = 0;
  let total = 0;

  for (const loopBody of scheduleBody) {
    const checkCart = await cartService.getCartItemById(
      loopBody,
      {
        include: [
          {
            model: Cart,
            include: [
              {
                model: User,
                as: 'student',
              },
              {
                model: User,
                as: 'teacher',
                include: {
                  model: UserDetail,
                  include: {
                    model: Price,
                  },
                },
              },
            ],
          },
          {
            model: TeacherSubject,
            include: [
              {
                model: Subject,
              },
              {
                model: Grade,
              },
            ],
          },
          {
            model: AvailabilityHours,
          },
        ],
      },
    );

    let pricePrivate = 0;
    let priceGroup = 0;

    // Cek harga
    if (checkCart.cart.teacher.userDetail.price) {
      pricePrivate = checkCart.cart.teacher.userDetail.price.private;
      priceGroup = checkCart.cart.teacher.userDetail.price.group;
    } else {
      const pricing = await Price.findOne(
        {
          where: {
            type: 'A',
          },
        },
      );

      pricePrivate = pricing.private;
      priceGroup = pricing.group;
    }

    const dataBody = {
      dateSchedule: moment(checkCart.startTime).format('YYYY-MM-DD'),
      typeClass: checkCart.typeCourse,
      statusSchedule: 'pending',
      teacherSubjectId: checkCart.teacherSubjectId,
      availabilityHoursId: checkCart.availabilityHoursId,
      teacherId: checkCart.teacherId,
      studentId: checkCart.cart.studentId,
      requestMaterial: checkCart.requestMaterial ? checkCart.requestMaterial : null,
      imageMaterial: checkCart.imageMaterial ? checkCart.imageMaterial : null,
      price: checkCart.typeCourse == 'private' ? pricePrivate : priceGroup,
    };
    total += dataBody.price;
    arrayDataBody.push(dataBody);
  }

  if (user.point < total) throw new ApiError(httpStatus.CONFLICT, 'Point anda tidak cukup untuk membeli kelas ini.');

  const schedule = await scheduleService.createSchedule(arrayDataBody);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Gagal membuat jadwal les. Harap hubungi administrator kita.');

  // const paying = user.point - total;

  // const updatePoint = await userService.updateUserById(
  //   id,
  //   {
  //     point: paying,
  //   },
  // );

  // if (!updatePoint) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengupdate saldo.');

  res.sendWrapped(arrayDataBody, httpStatus.CREATED);
  /*
    const user = await userService.getUserById(id);
    const teacherPrice = await userDetailService.getUserDetailByUserId(
      scheduleBody.teacherId,
      {
        include: Price,
      },
    );

      {
        "dateSchedule": "2022-01-30",
        "typeClass": "group",
        "statusSchedule": "pending",
        "teacherSubjectId": "55b29349-ddde-4340-88ed-432ef36022b5",
        "availabilityHoursId": "44cd1374-1811-44ab-a018-5642ca5d181d",
        "teacherId": "14c8ca1d-3405-4535-bf6a-7d117a092926",
        "studentId": "a9ef338f-9003-4685-86cb-6fa80856ffe0"
    }

    if (!teacherPrice) throw new ApiError(httpStatus.NOT_FOUND, 'Tutor belum melengkapi profilnya.');

    const { point } = user;
    const { price } = teacherPrice;

    const schedule = await scheduleService.createSchedule(scheduleBody);
  */
});

const getSchedule = catchAsync(async (req, res) => {
  let { page, limit } = req.params;

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
          include: [
            {
              model: Subject,
            },
            {
              model: Grade,
            },
          ],
        },
        {
          model: AvailabilityHours,
        },
      ],
    },
  );

  if (!schedule && schedule.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Don\'t have data schedule.');

  // Ambil data original
  const originalData = JSON.stringify(schedule);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

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
