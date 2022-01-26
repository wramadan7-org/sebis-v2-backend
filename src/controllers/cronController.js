const moment = require('moment');
const { Op } = require('sequelize');
const { Cart } = require('../models/Cart');
const { CartItem } = require('../models/CartItem');

const cartService = require('../services/cartService');

const {
  PENDING, ACCEPT, REJECT, CANCEL, EXPIRE, PROCESS, DONE,
} = process.env;

const cronJobCartPendingTwoHoursBeforeLes = async () => {
  const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');
  const twoHoursBeforeNow = moment().add(-2, 'hours').format('YYYY-MM-DD HH:mm:ss');

  const cartItem = await CartItem.findAll(
    {
      where: {
        cartItemStatus: PENDING,
        startTime: twoHoursBeforeNow,
      },
    },
  );

  if (cartItem || cartItem.length > 0) {
    const itemId = cartItem.map((o) => o.id);

    await CartItem.update(
      {
        cartItemStatus: EXPIRE,
      },
      {
        where: {
          id: {
            [Op.in]: itemId,
          },
        },
      },
    );
  }
};

module.exports = {
  cronJobCartPendingTwoHoursBeforeLes,
};
