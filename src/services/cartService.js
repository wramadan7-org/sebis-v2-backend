const httpStatus = require('http-status');
const { Cart } = require('../models/Cart');
const ApiError = require('../utils/ApiError');
const userService = require('./userService');

/**
 * Get cart by user ID
 * @param {String} studentId
 * @return {Promise<Cart | ApiError>}
 */
const getCartByStudentId = async (studentId) => {
  const cart = await Cart.findOne({
    where: {
      studentId,
    },
  });
  if (!cart) throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found.');
  return cart;
};

/**
 * Find or create cart
 * @param {String} studentId
 * @return {Promise<[Cart, Boolean] | ApiError>}
 */
const findOrCreateCart = async (studentId) => {
  await userService.getUserById(studentId);

  return Cart.findOrCreate({
    where: {
      studentId,
    },
  });
};

module.exports = {
  getCartByStudentId,
  findOrCreateCart,
};
