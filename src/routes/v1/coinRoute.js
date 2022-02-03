const { Router } = require('express');
const coinController = require('../../controllers/coinController');
const auth = require('../../middlewares/auth');
const {
  admin,
  administrator,
  verifikator,
  finance,
} = require('../../middlewares/roleValidation');

const router = Router();

router.get(
  '/',
  auth,
  admin,
  administrator,
  verifikator,
  finance,
  coinController.getCoin,
);
router.post(
  '/',
  auth,
  admin,
  administrator,
  verifikator,
  finance,
  coinController.createNewCoin,
);
router.patch(
  '/',
  auth,
  admin,
  administrator,
  verifikator,
  finance,
  coinController.updateCoin,
);
router.delete(
  '/',
  auth,
  admin,
  administrator,
  verifikator,
  finance,
  coinController.deleteCoin,
);
module.exports = router;
