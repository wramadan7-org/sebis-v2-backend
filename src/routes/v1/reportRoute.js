const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');

const reportController = require('../../controllers/reportController');

router.get('/', auth, reportController.getOwnListReport);
router.get('/:id', auth, reportController.getReportDetail);

module.exports = router;
