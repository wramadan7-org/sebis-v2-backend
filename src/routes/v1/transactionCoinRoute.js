const { Router } = require('express');

const router = Router();

const transactionCoinController = require('../../controllers/transactionCoinController');

// router.post('/', transactionCoinController.transactionCoin);
router.post('/payment-notif', transactionCoinController.paymentNotif);

module.exports = router;
