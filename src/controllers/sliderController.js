const httpStatus = require('http-status');
const {
  getAllSlider,
  getSliderByTitle,
  getSliderById,
  createSlider,
  updateSliderById,
  deleteSliderById,
} = require('../services/sliderService');
const catchAsync = require('../utils/catchAsync');
const { definePage, getPagingData } = require('../utils/pagination');

const getSlider = catchAsync(async (req, res) => {
  const { title, id } = req.query;
  const { page, size, offset } = definePage(req.query.page, req.query.size);
  let slider;
  slider = await getAllSlider(size, offset);
  if (title) {
    slider = await getSliderByTitle(title, size, offset);
  }
  if (id) {
    slider = await getSliderById(id);
  }

  const result = getPagingData(slider, page, size);

  res.sendWrapped(result, httpStatus.OK);
});

const createNewSlider = catchAsync(async (req, res) => {
  const { body } = req;
  const slider = await createSlider(body);
  res.sendWrapped(slider, httpStatus.CREATED);
});

const updateSlider = catchAsync(async (req, res) => {
  const { body } = req;
  const { id } = req.query;
  const slider = await updateSliderById(id, body);
  res.sendWrapped(slider, httpStatus.OK);
});

const deleteSlider = catchAsync(async (req, res) => {
  const { id } = req.query;
  await deleteSliderById(id);
  res.sendWrapped('Slider berahsil di hapus', httpStatus.OK);
});
module.exports = {
  getSlider,
  createNewSlider,
  updateSlider,
  deleteSlider,
};
