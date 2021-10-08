const express = require('express');
const studentController = require('../../controllers/studentController');

const router = express.Router();

router.get('/view-cart', studentController.viewCart);

module.exports = router;
