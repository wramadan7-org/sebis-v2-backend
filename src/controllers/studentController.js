const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
// const cartService = require('../services/cartService');
const {
  getUserById,
  updateUserById,
  getUserByIds,
} = require('../services/userService');

// const viewCart = catchAsync(async (req, res) => {
//   const studentId = req.user.id;
//   const cart = await cartService.findOrCreateCart(studentId, {
//     include: 'cartItems',
//   });
//   res.sendWrapped(cart[0], httpStatus.OK);
// });

const getCurrentStudentProfile = catchAsync(async (req, res) => {
  const { id } = req.user;

  const student = await getUserByIds(id);
  res.sendWrapped(student, httpStatus.OK);
});

const updateCurrentStudentProfie = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { body } = req;
  await updateUserById(id, body);
  const student = await getUserByIds(id);
  res.sendWrapped(student, httpStatus.OK);
});

module.exports = {
  //   viewCart,
  getCurrentStudentProfile,
  updateCurrentStudentProfie,
};
