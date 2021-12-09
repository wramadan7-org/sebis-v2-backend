const { Router } = require('express');
const migrateController = require('../../controllers/migrateController');
const validate = require('../../middlewares/validate');
// const migrateValidation = require('../../validations/migrateValidation')
const router = Router();

router.post('/', migrateController.listUser);

module.exports = router;
