const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const wishlistController = require('../../controllers/wishlistController');

router.post('/', auth, wishlistController.addWishlist);

module.exports = router;
