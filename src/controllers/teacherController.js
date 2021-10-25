const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const teacherDetailService = require('../services/userDetailService');
const ApiError = require('../utils/ApiError');

const createdUserDetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherBody = req.body;

  const checkTeacher = await teacherDetailService.getUserDetailByUserId(teacherId);

  if (checkTeacher) throw new ApiError(httpStatus.CONFLICT, 'You already have data');

  const teacher = await teacherDetailService.createUserDetail(teacherId, teacherBody);

  res.sendWrapped(teacher, httpStatus.OK);
});

const getUserDetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacher = await teacherDetailService.getUserDetailByUserId(
    teacherId,
    {
      include: ['user'],
    },
  );

  if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, 'User detail not found.');

  res.sendWrapped(teacher, httpStatus.OK);
});

module.exports = {
  createdUserDetail,
  getUserDetail,
};
