const { Router } = require('express');
const referralHistoryController = require('../../controllers/referralHistoryController');

const router = Router();

router.get('/', referralHistoryController.getReferralHistories);

module.exports = router;
