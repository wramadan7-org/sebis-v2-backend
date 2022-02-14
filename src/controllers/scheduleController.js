const httpStatus = require('http-status');
const moment = require('moment');
const { condition } = require('sequelize');
const catchAsync = require('../utils/catchAsync');
const scheduleService = require('../services/scheduleService');
const cartService = require('../services/cartService');
const userService = require('../services/userService');
const userDetailService = require('../services/userDetailService');
const priceService = require('../services/priceService');
const tutoringTransactionService = require('../services/tutoringTransactionService');
const ApiError = require('../utils/ApiError');

const { User } = require('../models/User');
const { UserDetail } = require('../models/UserDetail');
const { Cart } = require('../models/Cart');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Price } = require('../models/Price');

const pagination = require('../utils/pagination');
const dates = require('../utils/date');
const days = require('../utils/day');

const {
  PENDING, ACCEPT, REJECT, CANCEL, PROCESS, EXPIRE, DONE, DELETE,
} = process.env;

const createSchedule = catchAsync(async (req, res) => {
  const { id } = req.user;
  const scheduleBody = req.body;

  if (scheduleBody.length <= 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Masukkan data dengan benar.');

  const user = await userService.getUserById(id);

  const arrayDataBody = [];
  let discount = 0;
  let subtotal = 0;
  let total = 0;

  const conditionStatus = [
    PENDING,
    REJECT,
    CANCEL,
    PROCESS,
    EXPIRE,
    DONE,
    DELETE,
  ];

  for (const loopBody of scheduleBody) {
    const checkCart = await cartService.getCartItemById(loopBody, {
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
    });

    const checkStatusCartItem = conditionStatus.some((value) => checkCart.cartItemStatus.includes(value));

    if (checkStatusCartItem) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Hanya bisa menambah item yang sudah di setujui oleh guru.',
      );
    }

    let pricePrivate = 0;
    let priceGroup = 0;

    // Cek harga
    if (checkCart.cart.teacher.userDetail.price) {
      pricePrivate = checkCart.cart.teacher.userDetail.price.private;
      priceGroup = checkCart.cart.teacher.userDetail.price.group;
    } else {
      const pricing = await Price.findOne({
        where: {
          type: 'A',
        },
      });

      pricePrivate = pricing.private;
      priceGroup = pricing.group;
    }

    const dataBody = {
      dateSchedule: moment(checkCart.startTime).format('YYYY-MM-DD HH:mm:ss'),
      typeClass: checkCart.typeCourse,
      statusSchedule: PENDING,
      teacherSubjectId: checkCart.teacherSubjectId,
      availabilityHoursId: checkCart.availabilityHoursId,
      teacherId: checkCart.teacherId,
      studentId: checkCart.cart.studentId,
      requestMaterial: checkCart.requestMaterial
        ? checkCart.requestMaterial
        : null,
      imageMaterial: checkCart.imageMaterial ? checkCart.imageMaterial : null,
      price: checkCart.typeCourse == 'private' ? pricePrivate : priceGroup,
      // data untuk transaksi detail
      teacherName: `${checkCart.cart.teacher.firstName} ${checkCart.cart.teacher.lastName}`,
      lessonSchedule: checkCart.startTime,
      subject: checkCart.teacherSubject.subject.subjectName,
      grade: checkCart.teacherSubject.grade.gradeName,
      discount,
    };

    subtotal += Math.abs((discount / 100) * dataBody.price - dataBody.price);
    total += dataBody.price;
    arrayDataBody.push(dataBody);
  }

  const dataTransaction = {
    statusTransaction: DONE,
    discount,
    subtotal,
    total,
    paid: user.coin,
  };

  if (user.coin < total) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Point anda tidak cukup untuk membeli kelas ini.',
    );
  }

  const schedule = await scheduleService.createSchedule(arrayDataBody);

  if (!schedule) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Gagal membuat jadwal les. Harap hubungi administrator kita.',
    );
  }

  const transaction = await tutoringTransactionService.createTransactionLes(
    id,
    dataTransaction,
  );

  if (!transaction) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat transaksi');

  const arrayDataTransactionDetail = [];

  for (const loopForTransactionDetail of schedule) {
    const dataTransactionDetail = {
      tutoringTransactionId: transaction.dataValues.id,
      scheduleId: loopForTransactionDetail.schedule.dataValues.id,
      teacherName: loopForTransactionDetail.body.teacherName,
      lessonSchedule: loopForTransactionDetail.body.lessonSchedule,
      subject: loopForTransactionDetail.body.subject,
      grade: loopForTransactionDetail.body.grade,
      discount: loopForTransactionDetail.body.discount,
      price: loopForTransactionDetail.body.price,
    };

    arrayDataTransactionDetail.push(dataTransactionDetail);
  }

  const transactionDetail = await tutoringTransactionService.createTransactionDetailLes(
    arrayDataTransactionDetail,
  );

  if (!transactionDetail) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Gagal membuat transaksi detail.',
    );
  }

  const paying = user.coin - total;

  const updatePoint = await userService.updateUserById(id, {
    coin: paying,
  });
  if (!updatePoint) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengupdate saldo.');
  res.sendWrapped(arrayDataTransactionDetail, httpStatus.CREATED);

  // old logic
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

    const { coin } = user;
    const { price } = teacherPrice;

    const schedule = await scheduleService.createSchedule(scheduleBody);
  */
});

const getSchedule = catchAsync(async (req, res) => {
  let { page, limit } = req.query;

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

  const schedule = await scheduleService.getSchedule({
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
  });

  if (!schedule && schedule.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, "Don't have data schedule.");

  // Ambil data original
  const originalData = JSON.stringify(schedule);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  const arrayResults = [];

  for (const loopSchedule of convertData) {
    const convertDay = days(loopSchedule.availabilityHour.dayCode);
    const convertDate = loopSchedule.dateSchedule
      ? dates(loopSchedule.dateSchedule)
      : null;

    const dataSchedule = {
      scheduleId: loopSchedule.id,
      teacherId: loopSchedule.teacherId,
      studentId: loopSchedule.studentId,
      teacherSubjectId: loopSchedule.teacherSubjectId,
      availabilityHoursId: loopSchedule.availabilityHoursId,
      gradeId: loopSchedule.teacherSubject.gradeId,
      subjectId: loopSchedule.teacherSubject.subjectId,
      type: loopSchedule.typeClass,
      status: loopSchedule.statusSchedule,
      subject: loopSchedule.teacherSubject.subject.subjectName,
      grade: loopSchedule.teacherSubject.grade.gradeName,
      date: `${convertDay}, ${convertDate}`,
      time: `${loopSchedule.availabilityHour.timeStart} - ${loopSchedule.availabilityHour.timeEnd}`,
      requestMaterial: loopSchedule.requestMaterial
        ? loopSchedule.requestMaterial
        : null,
      imageMaterial: loopSchedule.imageMaterial
        ? loopSchedule.imageMaterial
        : null,
      createdAt: loopSchedule.createdAt,
      updatedAt: loopSchedule.updatedAt,
      dateSortingSchedule: loopSchedule.dateSchedule,
    };

    arrayResults.push(dataSchedule);
  }

  // Sorting schedule
  const sortingSchedule = arrayResults.sort(
    (a, b) => new Date(a.dateSortingSchedule) - new Date(b.dateSortingSchedule),
  );
  // Pagination data
  const paginateData = pagination.paginator(sortingSchedule, page, limit);

  res.sendWrapped('', httpStatus.OK, paginateData);
});

const getScheduleById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const schedule = await scheduleService.getScheduleById(id, {
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
            model: Grade,
          },
          {
            model: Subject,
          },
        ],
      },
      {
        model: AvailabilityHours,
      },
    ],
  });

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found.');

  // Ambil data original
  const originalData = JSON.stringify(schedule);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  const convertDay = days(convertData.availabilityHour.dayCode);
  const convertDate = convertData.dateSchedule
    ? dates(convertData.dateSchedule)
    : null;

  const dataSchedule = {
    scheduleId: convertData.id,
    teacherId: convertData.teacherId,
    studentId: convertData.studentId,
    teacherSubjectId: convertData.teacherSubjectId,
    availabilityHoursId: convertData.availabilityHoursId,
    gradeId: convertData.teacherSubject.gradeId,
    subjectId: convertData.teacherSubject.subjectId,
    type: convertData.typeClass,
    status: convertData.statusSchedule,
    subject: convertData.teacherSubject.subject.subjectName,
    grade: convertData.teacherSubject.grade.gradeName,
    date: `${convertDay}, ${convertDate}`,
    time: `${convertData.availabilityHour.timeStart} - ${convertData.availabilityHour.timeEnd}`,
    requestMaterial: convertData.requestMaterial
      ? convertData.requestMaterial
      : null,
    imageMaterial: convertData.imageMaterial ? convertData.imageMaterial : null,
    createdAt: convertData.createdAt,
    updatedAt: convertData.updatedAt,
    dateSortingSchedule: convertData.dateSchedule,
  };

  res.sendWrapped(dataSchedule, httpStatus.OK);
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
