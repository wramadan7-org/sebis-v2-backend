const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userDetailValidation = require('../../validations/userDetailValidation');
const userProfileValidation = require('../../validations/userProfileValidation');
const { teacher } = require('../../middlewares/roleValidation');
const teacherController = require('../../controllers/teacherController');

const router = express.Router();

router.post('/profile', auth, teacher, validate(userDetailValidation.createUserDetail), teacherController.createdUserDetail);
router.get('/profile', auth, teacher, teacherController.getUserDetail);
router.patch('/profile', auth, teacher, validate(userDetailValidation.updateUserDetail), teacherController.updateUserdetail);
router.delete('/profile', auth, teacher, teacherController.deleteUserDetail);

router.patch('/profile/basic-info', auth, teacher, validate(userProfileValidation.basicInfo), teacherController.basicInfo);
router.patch('/profile/personal-data', auth, teacher, validate(userProfileValidation.personalData), teacherController.personalData);
// /profile/teaching-experience [CRUD, no pagination]
// /profile/education-background [CRUD, no pagination]

module.exports = router;
