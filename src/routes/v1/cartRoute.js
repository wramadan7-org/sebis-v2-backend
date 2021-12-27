const express = require('express');
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const studentController = require('../../controllers/studentController');
const cartController = require('../../controllers/cartController');

const router = express.Router();

router.get('/', auth, student, cartController.viewCart);
router.post('/', auth, student, cartController.addCart);

module.exports = router;
