const { Router } = require('express');

const scheduleController = require('../../controllers/scheduleController');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const scheduleValidation = require('../../validations/scheduleValidation');

const router = Router();

router.post('/', auth, scheduleController.createSchedule);
router.get('/', scheduleController.getSchedule);
router.get('/my', auth, scheduleController.getMySchedule);
router.get('/history', auth, scheduleController.historySchedule);
router.get('/history-detail/:id', auth, scheduleController.historyScheduleDetail);
router.get('/:id', scheduleController.getScheduleById);
router.patch('/:id', scheduleController.updateSchedule);
router.patch('/request-materi/:id', auth, student, scheduleController.updateRequestMateri);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
