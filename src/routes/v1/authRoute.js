const express = require('express');
const passport = require('passport');
const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/authValidation');
const auth = require('../../middlewares/auth');
require('../../utils/googlePassport');
const { passportSetup } = require('../../utils/googlePassport');

const router = express.Router();

router.get('/google', passportSetup(), authController.loginByGoogle);

router.get(
  '/google/callback',
  passportSetup(),
  passport.authenticate('google'),
  authController.googleToken,
);
router.get('/success', auth, (req, res) => {
  res.send('testo');
});
router.post(
  '/register',
  validate(authValidation.register),
  authController.register,
);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', auth, authController.logout);
router.post(
  '/refresh',
  validate(authValidation.refresh),
  authController.refreshTokens,
);
router.get('/protected', auth, authController.testProtected);
router.post(
  '/reset-password',
  auth,
  validate(authValidation.resetPassword),
  authController.resetPassword,
);

module.exports = router;
