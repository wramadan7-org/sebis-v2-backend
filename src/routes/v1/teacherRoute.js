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

router.get('/profile/basic-info', auth, teacher, teacherController.getBasicInfo);
router.patch('/profile/basic-info', auth, teacher, validate(userProfileValidation.basicInfo), teacherController.createBasicInfo);
router.patch('/profile/personal-data', auth, teacher, validate(userProfileValidation.personalData), teacherController.createPersonalData);
router.post('/profile/teaching-experience', auth, teacher, teacherController.createTeachingExperience);
router.post('/profile/education-background', auth, teacher, teacherController.createEducationBackground);
// /profile/teaching-experience [CRUD, no pagination]
// /profile/education-background [CRUD, no pagination]

module.exports = router;
