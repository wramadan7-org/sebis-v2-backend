const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');

const reportController = require('../../controllers/reportController');

router.post('/:id', reportController.createReport);
router.get('/', auth, reportController.getOwnListReport);
router.get('/:id', auth, reportController.getReportDetail);
router.patch('/:id', auth, reportController.updateReport);

module.exports = router;
