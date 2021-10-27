const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const teacherDetailService = require('../services/userDetailService');
const teachingExperienceService = require('../services/teachingExperienceService');
const educationBackgroundService = require('../services/educationBackgroundService');
const ApiError = require('../utils/ApiError');
const { UserDetail } = require('../models/UserDetail');

const getBasicInfo = catchAsync(async (req, res) => {
  const teacherId = req.user.id;

  const basicTeacher = await userService.getUserById(
    teacherId,
    {
      include: [
        {
          model: UserDetail,
          attributes: [
            'religion',
            'birthPlace',
            'birthDate',
          ],
        },
      ],
      attributes: [
        'firstName',
        'lastName',
        'gender',
        'phoneNumber',
      ],
    },
  );

  res.sendWrapped(basicTeacher, httpStatus.OK);
});

const createBasicInfo = catchAsync(async (req, res) => {
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

const createPersonalData = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const personalDataBody = req.body;

  const teacher = await teacherDetailService.getUserDetailByUserId(teacherId);
  const checkTeacherIdCardNumber = await teacherDetailService.getAnotherUserDetailByCardNumber(personalDataBody.idCardNumber, teacherId);

  if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t haave user detail');

  Object.assign(teacher, personalDataBody);
  await teacher.save();

  res.sendWrapped(teacher, httpStatus.OK);
});

const createTeachingExperience = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teachingBody = req.body;

  const dataTeaching = {
    institute: teachingBody.institute,
    city: teachingBody.city,
    teachingStatus: teachingBody.teachingStatus,
    from: teachingBody.from,
    to: teachingBody.to,
    grade: 'V',
    subjects: 'matematika',
  };

  const teachingExperience = await teachingExperienceService.createTeachingExperience(teacherId, dataTeaching);

  res.sendWrapped(teachingExperience, httpStatus.CREATED);
});

const createEducationBackground = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const educationBody = req.body;

  const eduBackground = await educationBackgroundService.createEducationBackground(teacherId, educationBody);
  res.sendWrapped(eduBackground, httpStatus.CREATED);
});

const getEducationBackground = catchAsync(async (req, res) => {
  const teacherId = req.user.id;

  const eduBackground = await educationBackgroundService.getEducationBackground(teacherId);
  res.sendWrapped(eduBackground, httpStatus.OK);
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
  getBasicInfo,
  createBasicInfo,
  createPersonalData,
  createTeachingExperience,
  createEducationBackground,
  getEducationBackground,
};
