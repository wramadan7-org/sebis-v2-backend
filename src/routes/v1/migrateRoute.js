const { Router } = require('express');
const migrateController = require('../../controllers/migrateController');
const validate = require('../../middlewares/validate');
// const migrateValidation = require('../../validations/migrateValidation')
const router = Router();

router.get('/', migrateController.listUser);
router.post('/user', migrateController.addUser);
router.post('/user-detail', migrateController.addUserDetail);
router.post('/user-teaching-experience', migrateController.addTeachingExperiences);
router.post('/user-education-background', migrateController.addEducationBackground);

module.exports = router;
