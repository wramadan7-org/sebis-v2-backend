const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userDetailValidation = require('../../validations/userDetailValidation');
const { teacher } = require('../../middlewares/roleValidation');
const teacherController = require('../../controllers/teacherController');

const router = express.Router();

router.post('/detail', auth, teacher, validate(userDetailValidation.createUserDetail), teacherController.createdUserDetail);
router.get('/detail', auth, teacher, teacherController.getUserDetail);

module.exports = router;
