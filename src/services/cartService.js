const httpStatus = require('http-status');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');
const ApiError = require('../utils/ApiError');
const userService = require('./userService');

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
 * @param {String} studentId
 * @param {Object} opts
 * @return {Promise<Cart | ApiError>}
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
 * Create Cart Item
 * @param {teacherId} teacherId
 * @param {teacherId} body
 * @returns {Promise<CartItem | ApiError>}
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
 * @param {String} studentId
 * @param {Object} opts
 * @return {Promise<[Cart, Boolean] | ApiError>}
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
 * @param {String} teacherId
 * @param {String} cartItemStatus
 * @param {Object} opts
 * @return {Promise<[OrderList] | ApiError>}
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

module.exports = {
  getCartAll,
  getCartByStudentId,
  findOrCreateCart,
  createCartItem,
  orderList,
};
