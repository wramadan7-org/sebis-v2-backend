const express = require('express');
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const studentController = require('../../controllers/studentController');
// const cartController = require('../../controllers/cartController');

const router = express.Router();

// router.get('/cart', auth, student, cartController.viewCart);
// router.post('/cart', auth, student, cartController.addCart);
router.get(
  '/profile',
  auth,
  student,
  studentController.getCurrentStudentProfile,
);

module.exports = router;
