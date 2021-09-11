const express = require('express');
const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const { login, register, refresh } = require('../../validations/authValidation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(register), authController.register);
router.post('/login', validate(login), authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh', validate(refresh), authController.refreshTokens);

module.exports = router;
