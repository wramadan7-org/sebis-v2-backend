const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');

const favoriteTeacherController = require('../../controllers/favoriteTeacherController');

router.post('/', auth, student, favoriteTeacherController.createFavorite);

module.exports = router;
