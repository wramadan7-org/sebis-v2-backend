const httpStatus = require('http-status');
const {
  createPoint,
  getPointById,
  getAllPoint,
  getPointByPrice,
  updatePointById,
  deletePointById,
} = require('../services/pointService');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createNewPoint = catchAsync(async (req, res) => {
  const { body } = req;
  const point = await createPoint(body);
  res.sendwrapped(point, httpStatus.CREATED);
});

const getPoint = catchAsync(async (req, res) => {
  const { query } = req;
  let point;
  if (query.id) {
    point = await getPointById(query.id);
  }
  if (query.price) {
    point = await getPointByPrice(query.price);
  }
  point = await getAllPoint();

  if (!point) throw new ApiError(httpStatus.NOT_FOUND, 'Point tidak ditemukan');
  res.sendwrapped(point, httpStatus.OK);
});

const updatePoint = catchAsync(async (req, res) => {
  const { body } = req;
  const { id } = req.query;
  const point = await updatePointById(id, body);
  res.sendwrapped(point, httpStatus.OK);
});

const deletePoint = catchAsync(async (req, res) => {
  const { id } = req.query;
  const point = await deletePointById(id);
  if (point === 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal menghapus point');
  res.sendwrapped('Point berhasil di delete', httpStatus.OK);
});

module.exports = {
  createNewPoint,
  getPoint,
  updatePoint,
  deletePoint,
};
