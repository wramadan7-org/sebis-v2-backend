const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const { User } = require('../models/User');
const { Role } = require('../models/Role');
const { TeacherSubject } = require('../models/TeacherSubject');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const cartService = require('../services/cartService');
const scheduleService = require('../services/scheduleService');
const ApiError = require('../utils/ApiError');
const days = require('../utils/day');
const dates = require('../utils/date');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const pagination = require('../utils/pagination');

const {
  PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, DONE, OFFSET_ORDER_HOURS,
} = process.env;

// teacher
const getOrderList = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { cartItemStatus } = req.query;

  const cartItems = await cartService.orderList(
    teacherId,
    cartItemStatus,
    {
      include: [
        {
          model: Cart,
          include: [
            {
              model: User,
              as: 'student',
            },
          ],
        },
        {
          model: User,
          as: 'teacher',
        },
      ],
    },
  );

  if (!cartItems || cartItems.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'List order kosong.');

  res.sendWrapped(cartItems, httpStatus.OK);
});

const approvingOrder = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { cartItemId } = req.params;
  const { cartItemStatus } = req.body;

  const cartItem = await cartService.approvingCartRequest(
    cartItemId,
    teacherId,
    cartItemStatus,
  );

  res.sendWrapped(cartItem, httpStatus.OK);
});

// student
const addCart = catchAsync(async (req, res) => {
  const studentId = req.user.id;
  const {
    teacherId,
    typeCourse,
    startTime,
    endTime,
    teacherSubjectId,
    availabilityHoursId,
  } = req.body;

  // Pengecekan jam untuk melakukan pemesanan les
  const currentHour = parseInt(moment().format('H'));
  if (currentHour >= 22 || currentHour <= 5) throw new ApiError(httpStatus.BAD_REQUEST, 'Batas jam pemesanan les hanya pukul 06:00 WIB - 21:59 WIB!');

  const createCart = await cartService.findOrCreateCart(studentId, teacherId);

  if (!createCart) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat cart');

  const cartItemData = {
    cartItemStatus: 'pending',
    typeCourse,
    startTime: moment(startTime).format('YYYY-MM-DD HH:mm'),
    endTime: moment(endTime).format('YYYY-MM-DD HH:mm'),
    cartId: createCart[0].id,
    teacherSubjectId,
    availabilityHoursId,
  };

  // Cek apakah jam sekarang berseilih lebih dari 2 jam dari jadwal les
  const offsetHours = parseInt(OFFSET_ORDER_HOURS);
  const checkBetweenHours = await cartService.checkBetweenHours(cartItemData.startTime, offsetHours);

  if (!checkBetweenHours) throw new ApiError(httpStatus.CONFLICT, `Jam kursus hanya bisa diatas ${offsetHours} Jam dari sekarang`);

  // Ambil semua data keranjang milik kita sendiri
  const ownCart = await cartService.getCartByStudentId(studentId);

  if (!ownCart && ownCart.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Anda belum memiliki keranjang.');

  const mapCartId = ownCart.map((o) => o.id);

  // Cek cart sudah ada atau belum
  const checkCartItem = await cartService.checkerCartItem(
    teacherSubjectId,
    moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
    mapCartId,
  );

  // Jika hasil dari pengecekan true(cart sudah ada), maka tampilkan error
  if (checkCartItem) throw new ApiError(httpStatus.CONFLICT, `Sudah ada yang membeli jadwal di jam dan tanggal ini ${moment(startTime).format('YYYY-MM-DD HH:mm:ss')}`);

  // Cek apakah sudah memiliki les di tanggal dan jam yang sama
  const checkSchedule = await scheduleService.checkAvailDateSchedule(studentId, moment(startTime).format('YYYY-MM-DD'), availabilityHoursId);

  // Jika ada maka response true dan mengirim pesan error
  if (checkSchedule) throw new ApiError(httpStatus.CONFLICT, 'Anda sudah memiliki jadwal les di jam dan tanggal ini.');

  // Buat item cart
  const createCartItem = await cartService.createCartItem(
    teacherId,
    cartItemData,
  );

  if (!createCartItem) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal menambah item');

  res.sendWrapped({ createCart, createCartItem }, httpStatus.OK);
});

const viewCart = catchAsync(async (req, res) => {
  let { page, limit } = req.query;
  const studentId = req.user.id;

  if (page) {
    parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    parseInt(limit);
  } else {
    limit = 10;
  }

  const cart = await cartService.getCartByStudentId(studentId, {
    include: [
      {
        model: User,
        as: 'student',
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: Role,
          attributes: ['roleName'],
        },
      },
      {
        model: User,
        as: 'teacher',
        attributes: {
          exclude: ['password'],
        },
        include: {
          model: Role,
          attributes: ['roleName'],
        },
      },
      {
        model: CartItem,
        include: [
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
    ],
  });

  // Ambil data original
  const originalData = JSON.stringify(cart);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  const mapingData = convertData.map((o) => {
    const arrayResults = [];
    const item = o.cartItems.map((itm) => {
      const convertDay = itm.availabilityHour ? days(itm.availabilityHour.dayCode) : days(moment(itm.startTime).day());
      const convertDate = itm.startTime ? dates(itm.startTime) : null;

      const dataCartItem = {
        cartItemId: itm.id,
        teacherId: itm.teacherId,
        teacherSubjectId: itm.teacherSubjectId,
        availabilityHoursId: itm.availabilityHoursId,
        gradeId: itm.teacherSubject.gradeId,
        subjectId: itm.teacherSubject.subjectId,
        type: itm.teacherSubject.type,
        subject: itm.teacherSubject.subject.subjectName,
        grade: itm.teacherSubject.grade.gradeName,
        date: `${convertDay}, ${convertDate}`,
        time: `${moment(itm.startTime).format('HH:mm')} - ${moment(itm.endTime).format('HH:mm')}`,
        status: itm.cartItemStatus,
        createdAt: itm.createdAt,
        updatedAt: itm.updatedAt,
      };

      return arrayResults.push(dataCartItem);
    });

    // Sorting item cart
    const sortingItem = arrayResults.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const data = {
      cartId: o.id,
      studentId: o.studentId,
      teacherId: o.teacherId,
      student: `${o.student.firstName} ${o.student.lastName}`,
      teacher: `${o.teacher.firstName} ${o.teacher.lastName}`,
      profile: o.student.profile,
      referralCOde: o.student.referralCode,
      referredBy: o.student.referredBy,
      cartItems: sortingItem,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  const sorting = mapingData.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
  const paginateData = pagination(sorting, page, limit);

  res.sendWrapped(paginateData, httpStatus.OK);

  /**
  // Ambil data original
  const originalData = JSON.stringify(cart[0]);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let arrayCartItems = [];

  // Looping untuk mengganti formating tanggal les
  if (convertData.cartItems && convertData.cartItems.length > 0) {
    for (const loopCartItems of convertData.cartItems) {
      const convertDay = loopCartItems.availabilityHour ? days(loopCartItems.availabilityHour.dayCode) : days(moment(loopCartItems.startTime).day());
      const convertDate = loopCartItems.startTime ? dates(loopCartItems.startTime) : null;
      const dataCartItem = {
        cartItemId: loopCartItems.id,
        teacherId: loopCartItems.teacherId,
        teacherSubjectId: loopCartItems.teacherSubjectId,
        availabilityHoursId: loopCartItems.availabilityHoursId,
        gradeId: loopCartItems.teacherSubject.gradeId,
        subjectId: loopCartItems.teacherSubject.subjectId,
        teacher: `${loopCartItems.teacher.firstName} ${loopCartItems.teacher.lastName}`,
        type: loopCartItems.teacherSubject.type,
        subject: loopCartItems.teacherSubject.subject.subjectName,
        grade: loopCartItems.teacherSubject.grade.gradeName,
        date: `${convertDay}, ${convertDate}`,
        time: `${moment(loopCartItems.startTime).format('HH:mm')} - ${moment(loopCartItems.endTime).format('HH:mm')}`,
      };
      arrayCartItems.push(dataCartItem);
    }
  }

  // Ambil data original kemudian ganti key cartItems menjadi arrayCartItems
  convertData.cartItems = arrayCartItems;

  const data = {
    cartId: convertData.id,
    studentId: convertData.studentId,
    student: `${convertData.student.firstName} ${convertData.lastName}`,
    profile: convertData.student.profile,
    referralCOde: convertData.student.referralCode,
    referredBy: convertData.student.referredBy,
    cartItems: arrayCartItems,
  };

  const mapToDistinct = new Map();

  arrayCartItems.forEach((item) => mapToDistinct.set(item.teacherId, { ...mapToDistinct.get(item.teacherId), ...item }));

  const results = Array.from(mapToDistinct.values());
*/
});

const updateStatusCart = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { cartItemStatus } = req.body;

  const cartItem = await cartService.updateCart(id, cartItemStatus);

  res.sendWrapped(cartItem, httpStatus.OK);
});

const deleteCartItem = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const cartItem = await cartService.deleteCartItem(id);

  res.sendWrapped(cartItem, httpStatus.OK);
});

module.exports = {
  getOrderList,
  addCart,
  approvingOrder,
  viewCart,
  updateStatusCart,
  deleteCartItem,
};
