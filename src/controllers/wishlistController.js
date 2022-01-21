const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const wishlistService = require('../services/wishlistService');
const { User } = require('../models/User');
const { WishlistItem } = require('../models/WishlistItem');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const ApiError = require('../utils/ApiError');

const { OFFSET_ORDER_HOURS } = process.env;

const addWishlist = catchAsync(async (req, res) => {
  const { id } = req.user;
  const wishlistBody = req.body;

  const wishlist = await wishlistService.findOrCreateWishlist(
    id,
    wishlistBody.teacherId,
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

  const dataWishlistItem = {
    teacherId: wishlistBody.teacherId,
    teacherSubjectId: wishlistBody.teacherSubjectId,
    availabilityHoursId: wishlistBody.availabilityHoursId,
    typeCourse: wishlistBody.typeCourse,
    dateTimeStart: moment(wishlistBody.dateTimeStart).format('YYYY-MM-DD HH:mm:ss'),
    dateTimeEnd: moment(wishlistBody.dateTimeEnd).format('YYYY-MM-DD HH:mm:ss'),
  };

  // Cek apakah jam sekarang berseilih lebih dari 2 jam dari jadwal les
  const offsetHours = parseInt(OFFSET_ORDER_HOURS);
  const checkBetweenHours = await wishlistService.checkBetweenHours(
    dataWishlistItem.dateTimeStart,
    offsetHours,
  );

  if (!checkBetweenHours) throw new ApiError(httpStatus.CONFLICT, `Penambahan wishlist maksimal ${offsetHours} jam sebelum kelas dimulai`);

  // Cek untuk melihat apakah sudah ada wishlist yang sama
  const ownWishlist = await wishlistService.getWishlistByStudentId(id);
  const mapWishlistId = ownWishlist.map((o) => o.id);

  const wishlistChecker = await wishlistService.checkerWishlist(
    wishlistBody.teacherId,
    mapWishlistId,
    wishlistBody.teacherSubjectId,
    wishlistBody.availabilityHoursId,
  );

  if (wishlistChecker) throw new ApiError(httpStatus.CONFLICT, 'Anda sudah memiliki wishlist ini.');

  const createWishlistItem = await wishlistService.createWishlistItem(wishlist[0].id, dataWishlistItem);

  if (!createWishlistItem) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan item wishlist.');

  res.sendWrapped({ wishlist, createWishlistItem }, httpStatus.CREATED);
});

const getWishlist = catchAsync(async (req, res) => {
  const studentId = req.user.id;

  const wishlist = await wishlistService.getWishlistByStudentId(
    studentId,
    {
      include: [
        {
          model: User,
          as: 'student',
          attributes: {
            exlude: ['password'],
          },
        },
        {
          model: User,
          as: 'teacher',
          attributes: {
            exlude: ['password'],
          },
        },
        {
          model: WishlistItem,
          include: [
            {
              model: TeacherSubject,
              include: [
                {
                  model: Subject,
                },
                {
                  model: Grade,
                },
              ],
            },
            {
              model: AvailabilityHours,
            },
          ],
        },
      ],
    },
  );

  res.sendWrapped(wishlist, httpStatus.OK);
});

const getWihslistItemById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const wishlist = await wishlistService.getWishlistItemById(id, studentId);

  res.sendWrapped(wishlist, httpStatus.OK);
});

module.exports = {
  addWishlist,
  getWishlist,
  getWihslistItemById,
};
