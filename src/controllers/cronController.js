const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');

const cartService = require('../services/cartService');

const cronJobCartExperience = async () => {
  console.log('alah kintil');
};

module.exports = {
  cronJobCartExperience,
};
