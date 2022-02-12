const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pagination = require('../utils/pagination');

const favoriteTeacherService = require('../services/favoriteTeacherService');
const { User } = require('../models/User');

const createFavorite = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { teacherId } = req.body;

  const checkFavorite = await favoriteTeacherService.getFavoriteByStudentAndTeacher(id, teacherId);

  if (checkFavorite) throw new ApiError(httpStatus.CONFLICT, 'Guru sudah ada di favorit Anda.');

  const favorite = await favoriteTeacherService.createFavorite(id, teacherId);

  if (!favorite) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan guru ke favorit.');

  res.sendWrapped(favorite, httpStatus.CREATED);
});

const getMyFavoriteTeacher = catchAsync(async (req, res) => {
  const { id } = req.user;
  let { page, limit } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const favorite = await favoriteTeacherService.getMyFavoriteTeacher(
    id,
    {
      include: [
        {
          model: User,
          as: 'student',
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: User,
          as: 'teacher',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    },
  );

  // Sorting schedule
  const sorting = favorite.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  // Pagination data
  const paginate = pagination(sorting, page, limit);

  res.sendWrapped('', httpStatus.OK, paginate);
});

module.exports = {
  createFavorite,
  getMyFavoriteTeacher,
};
