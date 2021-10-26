const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const teacherDetailService = require('../services/userDetailService');
const ApiError = require('../utils/ApiError');
const { UserDetail } = require('../models/UserDetail');

const basicInfo = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherBody = req.body;

  // get user body
  // get userDetail from user.userDetail

  // find teacher
  // find teacherDetail

  // assign value from user body to teacher
  // assign value from userDetail body to teacherDetail

  // save teacher & teacherDetail

  const basicTeacher = await userService.getUserById(
    teacherId,
    {
      include: [
        'userDetail',
      ],
    },
  );

  const basicInfoData = {
    firstName: teacherBody.firstName || basicTeacher.firstName,
    lastName: teacherBody.lastName || basicTeacher.lastName,
    phoneNumber: teacherBody.phoneNumber || basicTeacher.phoneNumber,
    gender: teacherBody.gender || basicTeacher.gender,
  };

  let personalData;

  if (basicTeacher.userDetail !== null) {
    personalData = {
      religion: teacherBody.religion || basicTeacher.userDetail.religion,
      birthPlace: teacherBody.birthPlace || basicTeacher.userDetail.birthPlace,
      birthDate: teacherBody.birthDate || basicTeacher.userDetail.birthDate,
    };
    Object.assign(basicTeacher.userDetail, personalData);
  } else {
    personalData = {
      religion: teacherBody.religion,
      birthPlace: teacherBody.birthPlace,
      birthDate: teacherBody.birthDate,
      userId: teacherId,
    };

    await UserDetail.create(personalData);
  }

  Object.assign(basicTeacher, basicInfoData);

  await basicTeacher.save();
  await basicTeacher.userDetail.save();

  res.sendWrapped(basicTeacher, httpStatus.OK);
});

const createdUserDetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherBody = req.body;

  const checkTeacher = await teacherDetailService.getUserDetailByUserId(teacherId);
  if (checkTeacher) throw new ApiError(httpStatus.CONFLICT, 'You already have data');

  const checkTeacherIdCardNumber = await teacherDetailService.getAnotherUserDetailByCardNumber(teacherBody.idCardNumber, teacherId);

  const teacher = await teacherDetailService.createUserDetail(teacherId, teacherBody);

  res.sendWrapped(teacher, httpStatus.OK);
});

const getUserDetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacher = await userService.getUserById(
    teacherId,
    {
      include: ['userDetail'],
    },
  );

  if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, 'User detail not found.');

  res.sendWrapped(teacher, httpStatus.OK);
});

const updateUserdetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const userDetailBody = req.body;

  const checkTeacher = await teacherDetailService.getUserDetailByUserId(teacherId);
  if (!checkTeacher) throw new ApiError(httpStatus.NOT_FOUND, 'User detail not found');

  const checkTeacherIdCardNumber = await teacherDetailService.getAnotherUserDetailByCardNumber(userDetailBody.idCardNumber, teacherId);

  const updating = await teacherDetailService.updateUserDetailByUserId(teacherId, userDetailBody);

  res.sendWrapped(updating, httpStatus.OK);
});

const deleteUserDetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacher = await teacherDetailService.deleteUserDetailById(teacherId);

  res.sendWrapped(teacher, httpStatus.OK);
});

module.exports = {
  createdUserDetail,
  getUserDetail,
  updateUserdetail,
  deleteUserDetail,
  basicInfo,
};
