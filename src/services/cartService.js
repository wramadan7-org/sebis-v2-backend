const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const ApiError = require('../utils/ApiError');
const userService = require('./userService');

const {
  PENDING, ACCEPT, REJECT, PROCESS, EXPIRE, DONE,
} = process.env;

/**
 * Check between hours
 * @param {string} scheduleTime
 * @param {number} offsetHours
 * @returns boolean
 */
const checkBetweenHours = async (scheduleTime, offsetHours) => {
  const dateNow = new Date();
  let tempCStart = new Date(`${scheduleTime}:00 GMT+0700`);
  let tempDateNow = new Date(`${dateNow} GMT+0700`);
  tempDateNow.setHours(tempDateNow.getHours() + offsetHours);

  if (tempCStart.getTime() < tempDateNow.getTime()) {
    return false;
  }

  return true;
};

/**
 * Check all cart item
 * @param {string} teacherSubjectId
 * @param {string} dateStart
  * @param {string} cartId
 * @param {object} opts
 * @returns boolean
 */
const checkerCartItem = async (teacherSubjectId, dateStart, cartId, opts = {}) => {
  /**
   * Why not use moment?
   * Because data in DB use Date and it same use new Date
   */
  const convertToDate = new Date(dateStart);

  const cartItem = await CartItem.findOne(
    {
      where: {
        teacherSubjectId,
        startTIme: convertToDate,
        cartItemStatus: {
          [Op.in]: [ACCEPT, PROCESS],
        },
      },
    },
  );

  // if true = cart already exists, if false = no one cart item like that

  if (cartItem) {
    if (cartItem.cartId == cartId) throw new ApiError(httpStatus.CONFLICT, 'Anda sudah memiliki les di jam dan tanggal ini.');
    return true;
  }

  return false;
};

/**
 * Get all cart
 * @param {string} query
 * @param {object} opts
 * @returns array of object
 */
const getCartAll = async (query, opts = {}) => {
  const carts = await Cart.findAll(
    {
      where: {
        query,
      },
    },
  );

  return carts;
};

/**
 * Get cart by user ID
 * @param {string} studentId
 * @param {object} opts
 * @return object
 */
const getCartByStudentId = async (studentId, opts = {}) => {
  const cart = await Cart.findOne({
    where: {
      studentId,
    },
    ...opts,
  });
  if (!cart) throw new ApiError(httpStatus.NOT_FOUND, 'Keranjang tidak ditemukan.');
  return cart;
};

/**
 * Get cart item by ID
 * @param {string} id
 * @param {string} teacherId
 * @param {object} opts
 * @return object
 */
const getCartItemById = async (id, teacherId, opts = {}) => {
  const cartItem = await CartItem.findOne({
    where: {
      id,
      teacherId,
    },
    ...opts,
  });
  if (!cartItem) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan item di keranjang.');
  return cartItem;
};

/**
 * Create Cart Item
 * @param {string} teacherId
 * @param {object} body
 * @returns object
 */
const createCartItem = async (teacherId, body) => {
  const cartItemData = {
    teacherId,
    ...body,
  };

  const cartItem = await CartItem.create(cartItemData);

  return cartItem;
};

/**
 * Find or create cart
 * @param {string} studentId
 * @param {object} opts
 * @return object
 */
const findOrCreateCart = async (studentId, opts = {}) => {
  await userService.getUserById(studentId);

  return Cart.findOrCreate({
    where: {
      studentId,
    },
    ...opts,
  });
};

// teacher

/**
 * List order
 * @param {string} teacherId
 * @param {string} cartItemStatus
 * @param {object} opts
 * @return array og object
 */
const orderList = async (teacherId, cartItemStatus, opts = {}) => {
  const orders = await CartItem.findAll(
    {
      where: {
        teacherId,
        cartItemStatus,
      },
      ...opts,
    },
  );

  return orders;
};

/**
 * Approve request cart
 * @param {string} id
 * @param {string} teacherId
 * @param {string} cartItemStatusBody
 * @param {object} opts
 * @returns object
 */
const approvingCartRequest = async (id, teacherId, cartItemStatusBody, opts = {}) => {
  const cartItem = await getCartItemById(id, teacherId);

  cartItem.cartItemStatus = cartItemStatusBody;
  cartItem.save();

  return cartItem;
};

const updateCart = async (id, cartItemStatus, userId) => {
  let cartItem;

  // Jika ada paramter userId maka udpate status cart bedasarkan cart anda sendiri
  if (userId) {
    const cart = await Cart.findOne(
      {
        where: {
          studentId: userId,
        },
      },
    );

    if (!cart) throw new ApiError(httpStatus.CONFLICT, 'Anda belum meiliki keranjang.');

    cartItem = await CartItem.findOne(
      {
        where: {
          id,
          cartId: cart.id,
        },
      },
    );
  } else {
    cartItem = await CartItem.findOne(
      {
        where: {
          id,
        },
      },
    );
  }

  if (!cartItem) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan item.');

  Object.assign(cartItem, { cartItemStatus });

  await cartItem.save();

  return cartItem;
};

const deleteCartItem = async (id) => {
  const cartItem = await CartItem.findOne(
    {
      where: {
        id,
      },
    },
  );

  if (!cartItem) throw new ApiError(httpStatus.NOT_FOUND, 'Item tidak ditemukan.');

  await cartItem.destroy();

  return cartItem;
};

module.exports = {
  getCartAll,
  getCartByStudentId,
  findOrCreateCart,
  createCartItem,
  orderList,
  approvingCartRequest,
  checkerCartItem,
  checkBetweenHours,
  updateCart,
  deleteCartItem,
};
