const express = require('express');
const profileController = require('../../controllers/profileController');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth, profileController.currentProfile);
router.post('/', auth, profileController.createUserDetail);

module.exports = router;
