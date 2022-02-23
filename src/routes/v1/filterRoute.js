const { Router } = require('express');

const router = Router();
const filterController = require('../../controllers/filterController');

router.post('/les', filterController.filterLes);

module.exports = router;
