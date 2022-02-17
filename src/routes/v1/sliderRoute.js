const express = require('express');
const auth = require('../../middlewares/auth');
const sliderController = require('../../controllers/sliderController');

const router = express.Router();

router.post('/', auth, sliderController.createNewSlider);
router.get('/', sliderController.getSlider);
router.patch('/', auth, sliderController.updateSlider);
router.delete('/', auth, sliderController.updateSlider);

module.exports = router;
