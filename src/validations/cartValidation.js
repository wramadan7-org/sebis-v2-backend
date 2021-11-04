const Joi = require('joi');
const { cartItemStatuses } = require('../constants/carts');

const getCart = {
  query: Joi.object().keys({
    cartItemStatus: Joi.string().valid(...Object.values(cartItemStatuses)).max(12).required(),
  }),
};

const statusCart = {
  body: Joi.object().keys({
    cartItemStatus: Joi.string().valid(...Object.values(cartItemStatuses)).max(12).required(),
  }),
};

module.exports = {
  getCart,
  statusCart,
};
