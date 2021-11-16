const { Router } = require('express');
const referralHistoryController = require('../../controllers/referralHistoryController');
const auth = require('../../middlewares/auth');

const router = Router();

router.get('/', auth, referralHistoryController.getReferralHistories);
router.get('/:referralHistoryId', auth, referralHistoryController.getReferralHistoryById);

module.exports = router;
