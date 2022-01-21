const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const wishlistController = require('../../controllers/wishlistController');

router.post('/', auth, wishlistController.addWishlist);
router.get('/', auth, wishlistController.getWishlist);
router.get('/:id', auth, wishlistController.getWihslistItemById);

module.exports = router;
