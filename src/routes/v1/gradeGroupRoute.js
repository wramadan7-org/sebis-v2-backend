const { Router } = require('express');
const validate = require('../../middlewares/validate');
const gradeGroupValidate = require('../../validations/gradeGroupValidation');
const gradeGroupController = require('../../controllers/gradeGroupController');

const router = Router();

router.post(
  '/',
  validate(gradeGroupValidate.createGradeGroup),
  gradeGroupController.createNewGradeGroup,
);
router.get('/', gradeGroupController.getGradeGroupAll);
router.get(
  '/:gradeGroupId',
  validate(gradeGroupValidate.getGradeGroupById),
  gradeGroupController.gradeGroupById,
);
router.patch(
  '/:gradeGroupId',
  validate(gradeGroupValidate.updateGradeGroup),
  gradeGroupController.updateGradeGroup,
);
router.delete(
  '/:gradeGroupId',
  validate(gradeGroupValidate.deleteGradeGroupByid),
  gradeGroupController.deleteGradeGroup,
);

module.exports = router;
