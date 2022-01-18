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

  if (!cartItems || cartItems.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t have order list.');

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

  const createCart = await cartService.findOrCreateCart(studentId);

  if (!createCart) throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to create cart.');

  const cartItemData = {
    cartItemStatus: 'pending',
    typeCourse,
    startTime: moment(startTime).format('YYYY-MM-DD HH:mm'),
    endTime: moment(endTime).format('YYYY-MM-DD HH:mm'),
    cartId: createCart[0].id,
    teacherSubjectId,
  };

  const checkSchedule = await scheduleService.checkAvailDateSchedule(studentId, moment(startTime).format('YYYY-MM-DD'), availabilityHoursId);

  if (checkSchedule) throw new ApiError(httpStatus.CONFLICT, 'You already have a schedule on this date and time');

  const createCartItem = await cartService.createCartItem(
    teacherId,
    cartItemData,
  );

  if (!createCartItem) throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to add cart item.');

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
  res.sendWrapped(cart[0], httpStatus.OK);
});

module.exports = {
  getOrderList,
  addCart,
  approvingOrder,
  viewCart,
};
