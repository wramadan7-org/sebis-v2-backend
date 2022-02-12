const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { FavoriteTeacher } = require('../models/FavoriteTeacher');

const userService = require('./userService');
const roleService = require('./roleService');

/**
 * Create favorite teacher
 * @param {string} studentId
 * @param {string} teacherId
 * @returns object
 */
const createFavorite = async (studentId, teacherId) => {
  const teacher = await userService.getUserById(teacherId);

  if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan guru.');

  const role = await roleService.getRoleById(teacher.roleId);

  if (!role || role.roleName !== 'teacher') throw new ApiError(httpStatus.CONFLICT, 'Hanya dapat menyukai user dengan status sebagai guru.');

  const data = {
    studentId,
    teacherId,
    like: true,
  };

  const like = await FavoriteTeacher.create(data);

  return like;
};

/**
 * Get favorite by student and teacher
 * @param {string} studentId
 * @param {string} teacherId
 * @param {object} opts
 * @returns object
 */
const getFavoriteByStudentAndTeacher = async (studentId, teacherId, opts = {}) => {
  const favorite = await FavoriteTeacher.findOne(
    {
      where: {
        studentId,
        teacherId,
        like: true,
      },
      ...opts,
    },
  );

  return favorite;
};

/**
 * Get favorite by id
 * @param {string} id
 * @returns object
 */
const getFavoriteById = async (id) => {
  const favorite = await FavoriteTeacher.findOne(
    {
      where: {
        id,
      },
    },
  );

  return favorite;
};

module.exports = {
  createFavorite,
  getFavoriteByStudentAndTeacher,
  getFavoriteById,
};
