const { Router } = require('express');

const availabilityHoursController = require('../../controllers/availabilityHoursController');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const availabilityHoursValidation = require('../../validations/availabilityHoursValidation');

const router = Router();

router.post('/', auth, validate(availabilityHoursValidation.createScheduleTime), availabilityHoursController.createTutorScheduleTime);
router.get('/', auth, availabilityHoursController.getTutorScheduleTimeAll);
router.get('/:availabilityHoursId', auth, validate(availabilityHoursValidation.getScheduleTimeById), availabilityHoursController.getTutorScheduleTimeById);
router.patch('/:availabilityHoursId', auth, validate(availabilityHoursValidation.updateScheduleTime), availabilityHoursController.updateTutorScheduleTime);

module.exports = router;
