const express = require('express');
const auth = require('../../middlewares/auth');
const sliderController = require('../../controllers/sliderController');
const userProfileValidation = require('../../validations/userProfileValidation');
const fileValidation = require('../../validations/fileValidation');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.post('/', auth, sliderController.createNewSlider);
router.get('/', sliderController.getSlider);
router.patch('/', auth, sliderController.updateSlider);
router.delete('/', auth, sliderController.updateSlider);
router.patch(
  '/file-picture',
  auth,
  validate(fileValidation.createFileProfile),
  sliderController.createFilePictureSlider,
);
module.exports = router;
