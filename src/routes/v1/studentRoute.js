const express = require('express');
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const studentController = require('../../controllers/studentController');

const router = express.Router();

router.get('/cart', auth, student, studentController.viewCart);

module.exports = router;
