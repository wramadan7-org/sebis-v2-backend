const { Router } = require('express');

const scheduleController = require('../../controllers/scheduleController');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const scheduleValidation = require('../../validations/scheduleValidation');

const router = Router();

router.post('/', validate(scheduleValidation.createSchedule), scheduleController.createSchedule);
router.get('/', scheduleController.getSchedule);
router.get('/:id', scheduleController.getScheduleById);
router.patch('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
