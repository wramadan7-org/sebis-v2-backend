const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const wishlistService = require('../services/wishlistService');
const { User } = require('../models/User');

const addWishlist = catchAsync(async (req, res) => {
  const { id } = req.user;
  const wishlistBody = req.body;

  const wishlist = await wishlistService.addWishlist(
    id,
    {
      include: [
        {
          model: User,
          as: 'student',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    },
  );

  res.sendWrapped(wishlist, httpStatus.CREATED);
});

module.exports = {
  addWishlist,
};
