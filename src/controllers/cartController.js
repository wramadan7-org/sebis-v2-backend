const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const { Cart } = require('../models/Cart');
const cartService = require('../services/cartService');
const ApiError = require('../utils/ApiError');

// teacher
const getOrderList = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { status } = req.query;

  const carts = await Cart.findAll({}, { include: 'cartItems' });
  res.sendWrapped(carts, httpStatus.OK);
});

// student
const addCart = catchAsync(async (req, res) => {
  const studentId = req.user.id;
  const {
    teacherId,
    typeCourse,
    startTime,
    endTime,
  } = req.body;

  const createCart = await cartService.findOrCreateCart(studentId);

  if (!createCart) throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to create cart.');

  const cartItemData = {
    cartItemStatus: 'pending',
    typeCourse,
    startTime: moment(startTime).format('YYYY-MM-DD HH:mm'),
    endTime: moment(endTime).format('YYYY-MM-DD HH:mm'),
    cartId: createCart[0].id,
  };

  const createCartItem = await cartService.createCartItem(
    teacherId,
    cartItemData,
  );

  if (!createCartItem) throw new ApiError(httpStatus.BAD_REQUEST, 'Fail to add cart item.');

  res.sendWrapped({ createCart, createCartItem }, httpStatus.OK);
});

module.exports = {
  getOrderList,
  addCart,
};
