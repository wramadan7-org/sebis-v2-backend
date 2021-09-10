const express = require('express');
const schoolController = require('../../controllers/schoolController');
const validate = require('../../middlewares/validate');
const { createSchool } = require('../../validations/schoolValidation');

const router = express.Router();

router.post('/', validate(createSchool), schoolController.createSchool);

module.exports = router;
