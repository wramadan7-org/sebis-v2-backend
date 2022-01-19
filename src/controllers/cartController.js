const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const { User } = require('../models/User');
const { Role } = require('../models/Role');
const { TeacherSubject } = require('../models/TeacherSubject');
const cartService = require('../services/cartService');
const scheduleService = require('../services/scheduleService');
const ApiError = require('../utils/ApiError');

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

  const createCart = await cartService.findOrCreateCart(studentId);

  if (!createCart) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat cart');

  const cartItemData = {
    cartItemStatus: 'pending',
    typeCourse,
    startTime: moment(startTime).format('YYYY-MM-DD HH:mm'),
    endTime: moment(endTime).format('YYYY-MM-DD HH:mm'),
    cartId: createCart[0].id,
    teacherSubjectId,
  };

  // Cek apakah jam sekarang berseilih lebih dari 2 jam dari jadwal les
  const offsetHours = parseInt(OFFSET_ORDER_HOURS);
  const checkBetweenHours = await cartService.checkBetweenHours(cartItemData.startTime, offsetHours);

  if (!checkBetweenHours) throw new ApiError(httpStatus.CONFLICT, `Jam kursus hanya bisa diatas ${offsetHours} Jam dari sekarang`);

  // Cek cart sudah ada atau belum
  const checkCartItem = await cartService.checkerCartItem(
    teacherSubjectId,
    moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
    createCart[0].id,
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
  const studentId = req.user.id;
  const cart = await cartService.findOrCreateCart(studentId, {
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
        model: CartItem,
        include: [
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
            model: TeacherSubject,
          },
        ],
      },
    ],
  });

  /**
   // Ambil data original
  const originalData = JSON.stringify(cart[0]);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  let arrayCartItems = [];

  // Looping untuk mengganti formating tanggal les
  if (convertData.cartItems && convertData.cartItems.length > 0) {
    for (const loopCartItems of convertData.cartItems) {
      const dataCartItem = {
        ...loopCartItems,
        startTime: moment(loopCartItems.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(loopCartItems.endTime).format('YYYY-MM-DD HH:mm:ss'),
      };
      arrayCartItems.push(dataCartItem);
    }
  }

  // Ambil data original kemudian ganti key cartItems menjadi arrayCartItems
  convertData.cartItems = arrayCartItems;
  */

  res.sendWrapped(cart[0], httpStatus.OK);
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
