const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const favoriteTeacherService = require('../services/favoriteTeacherService');

const createFavorite = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { teacherId } = req.body;

  const checkFavorite = await favoriteTeacherService.getFavoriteByStudentAndTeacher(id, teacherId);

  if (checkFavorite) throw new ApiError(httpStatus.CONFLICT, 'Guru sudah ada di favorit Anda.');

  const favorite = await favoriteTeacherService.createFavorite(id, teacherId);

  if (!favorite) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan guru ke favorit.');

  res.sendWrapped(favorite, httpStatus.CREATED);
});

module.exports = {
  createFavorite,
};
