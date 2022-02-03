const { Router } = require('express');
const pointController = require('../../controllers/pointController');
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
  pointController.getPoint,
);
router.post(
  '/',
  auth,
  admin,
  administrator,
  verifikator,
  finance,
  pointController.createNewPoint,
);
router.patch(
  '/',
  auth,
  admin,
  administrator,
  verifikator,
  finance,
  pointController.updatePoint,
);
router.delete(
  '/',
  auth,
  admin,
  administrator,
  verifikator,
  finance,
  pointController.deletePoint,
);
module.exports = router;
