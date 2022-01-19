const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Wishlist } = require('../models/Wishlist');

const addWishlist = async (id, opts = {}) => {
  const wihslist = await Wishlist.findOrCreate(
    {
      where: {
        studentId: id,
      },
      ...opts,
    },
  );

  return wihslist;
};

module.exports = {
  addWishlist,
};
