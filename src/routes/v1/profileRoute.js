const express = require('express');
const profileController = require('../../controllers/profileController');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, profileController.currentProfile);

module.exports = router;
