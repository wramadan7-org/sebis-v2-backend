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
const days = require('../utils/day');
const dates = require('../utils/date');
const pagination = require('../utils/pagination');

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
  let { page, limit } = req.query;
  const studentId = req.user.id;

  if (page) {
    parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    parseInt(limit);
  } else {
    limit = 10;
  }

  const wishlist = await wishlistService.getWishlistByStudentId(
    studentId,
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

  // Ambil data original
  const originalData = JSON.stringify(wishlist);
  // Kemudian parsing ke JSON untuk pendefinisian
  const convertData = JSON.parse(originalData);

  const mapingData = convertData.map((o) => {
    const arrayWishlistItem = [];

    if (o.WishlistItems && o.WishlistItems.length > 0) {
      o.WishlistItems.map((itm) => {
        const convertDay = itm.availabilityHour ? days(itm.availabilityHour.dayCode) : days(moment(itm.dateTimeStart).day());
        const convertDate = itm.dateTimeStart ? dates(itm.dateTimeStart) : null;

        const dataWishlistItem = {
          wishlistItemId: itm.id,
          teacherSubjectId: itm.teacherSubjectId,
          availabilityHoursId: itm.availabilityHoursId,
          teacherId: itm.teacherId,
          typeCourse: itm.typeCourse,
          date: `${convertDay}, ${convertDate}`,
          time: `${moment(itm.dateTimeStart).format('HH:mm')} - ${moment(itm.dateTimeEnd).format('HH:mm')}`,
          subject: itm.teacherSubject.subject.subjectName,
          grade: itm.teacherSubject.gradeName,
          createdAt: itm.createdAt,
          updatedAt: itm.updatedAt,
        };

        return arrayWishlistItem.push(dataWishlistItem);
      });
    }

    // Sorting isi item
    const sortingItem = arrayWishlistItem.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const data = {
      wishlistId: o.id,
      studentId: o.studentId,
      teacherId: o.teacherId,
      student: `${o.student.firstName} ${o.student.lastName}`,
      teacher: `${o.teacher.firstName} ${o.teacher.lastName}`,
      wishlistItems: sortingItem,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  // Filter untuk menampikan data yang memiliki item wishlist
  const filteringItem = mapingData.filter((o) => o.wishlistItems.length > 0);
  // Sorting parent
  const sorting = filteringItem.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const paginateData = pagination(sorting, page, limit);

  res.sendWrapped('', httpStatus.OK, paginateData);
});

const getWihslistItemById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const wishlist = await wishlistService.getWishlistItemById(id, studentId);

  res.sendWrapped(wishlist, httpStatus.OK);
});

const deleteWishlistItemById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const wishlist = await wishlistService.getWishlistItemById(id);

  if (!wishlist) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan item wishlist.');

  const deleteWishlist = await wishlistService.deleteWishlistItemById(wishlist.id);

  if (!deleteWishlist) throw new ApiError(httpStatus.CONFLICT, 'Gagal menghapus item wishlist.');

  res.sendWrapped(deleteWishlist, httpStatus.OK);
});

module.exports = {
  addWishlist,
  getWishlist,
  getWihslistItemById,
  deleteWishlistItemById,
};
