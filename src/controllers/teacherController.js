const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const teacherDetailService = require('../services/userDetailService');

const createdUserDetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherBody = req.body;
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

  res.sendWrapped(teacher, httpStatus.OK);
});

module.exports = {
  createdUserDetail,
  getUserDetail,
};
