const express = require('express');
const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const { login, register } = require('../../validations/authValidation');

const router = express.Router();

router.post('/register', validate(register), authController.register);
router.post('/login', validate(login), authController.login);

module.exports = router;
