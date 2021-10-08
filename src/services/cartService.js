const httpStatus = require('http-status');
const { Cart } = require('../models/Cart');
const ApiError = require('../utils/ApiError');
const userService = require('./userService');

/**
 * Get cart by user ID
 * @param {String} userId
 * @return {Promise<Cart | ApiError>}
 */
const getCartByUserId = async (userId) => {
  const cart = await Cart.findOne({
    userId,
  });
  if (!cart) throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found.');
  return cart;
};

/**
 * Find or create cart
 * @param {String} userId
 * @return {Promise<[Cart, Boolean] | ApiError>}
 */
const findOrCreateCart = async (userId) => {
  await userService.getUserById(userId);

  return Cart.findOrCreate({
    where: {
      userId,
    },
  });
};

module.exports = {
  getCartByUserId,
  findOrCreateCart,
};
