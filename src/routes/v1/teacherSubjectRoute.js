const { Router } = require('express');
const { teacher } = require('../../middlewares/roleValidation');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const teacherSubjectController = require('../../controllers/teacherSubjectController');

const router = Router();

router.post('/', auth, teacher, teacherSubjectController.createTeacherSubject);
router.get('/', auth, teacher, teacherSubjectController.getTeacherSubjectAll);

module.exports = router;
