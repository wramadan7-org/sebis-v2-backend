const express = require('express');
const schoolController = require('../../controllers/schoolController');
const validate = require('../../middlewares/validate');
const schoolValidation = require('../../validations/schoolValidation');

const router = express.Router();

router.post('/', validate(schoolValidation.createSchool), schoolController.createSchool);

module.exports = router;
