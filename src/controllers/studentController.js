// const httpStatus = require('http-status');
// const catchAsync = require('../utils/catchAsync');
// const cartService = require('../services/cartService');

// const viewCart = catchAsync(async (req, res) => {
//   const studentId = req.user.id;
//   const cart = await cartService.findOrCreateCart(studentId, {
//     include: 'cartItems',
//   });
//   res.sendWrapped(cart[0], httpStatus.OK);
// });

// module.exports = {
//   viewCart,
// };
