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
 * Get cart item by ID
 * @param {String} id
 * @param {String} teacherId
 * @param {Object} opts
 * @return {Promise<CartItem | ApiError>}
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
