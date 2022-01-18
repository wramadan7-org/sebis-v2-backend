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
    if (cartItem.cartId == cartId) throw new ApiError(httpStatus.CONFLICT, 'You already have this les.');
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
  if (!cart) throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found.');
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
  if (!cartItem) throw new ApiError(httpStatus.NOT_FOUND, 'Cart items not found.');
  return cartItem;
};

/**
 * Create Cart Item
 * @param {string} teacherId
 * @param {object} body
 * @returns object
 */
const createCartItem = async (teacherId, body) => {
  const checkCartItem = await checkerCartItem(
    body.teacherSubjectId,
    moment(body.startTime).format('YYYY-MM-DD HH:mm:ss'),
    body.cartId,
  );

  // Jika hasil dari pengecekan true(cart sudah ada), maka tampilkan error
  if (checkCartItem) throw new ApiError(httpStatus.CONFLICT, `Cart at ${moment(body.startTime).format('YYYY-MM-DD HH:mm:ss')} already order by another student`);

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

module.exports = {
  getCartAll,
  getCartByStudentId,
  findOrCreateCart,
  createCartItem,
  orderList,
  approvingCartRequest,
};
