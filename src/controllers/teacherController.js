const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/userService');
const teacherDetailService = require('../services/userDetailService');
const teachingExperienceService = require('../services/teachingExperienceService');
const educationBackgroundService = require('../services/educationBackgroundService');
const ApiError = require('../utils/ApiError');
const { UserDetail } = require('../models/UserDetail');
const { TeachingExperience } = require('../models/TeachingExperience');
const { TeachingExperienceDetail } = require('../models/TeachingExperienceDetail');
const { EducationBackground } = require('../models/EducationBackground');
const multering = require('../utils/multer');

const profileInfo = catchAsync(async (req, res) => {
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
        {
          model: TeachingExperience,
          include: [
            {
              model: TeachingExperienceDetail,
            },
          ],
        },
        {
          model: EducationBackground,
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

  const { teachingExperienceDetails } = teachingBody;

  const teachingExperienceData = {
    universityName: teachingBody.universityName,
    universityCity: teachingBody.universityCity,
    teachingStatus: teachingBody.teachingStatus,
    teachingFrom: teachingBody.teachingFrom,
    teachingTo: teachingBody.teachingTo,
  };

  const teachingExperience = await teachingExperienceService.createTeachingExperience(teacherId, teachingExperienceData, teachingExperienceDetails);

  res.sendWrapped(teachingExperience, httpStatus.CREATED);
});

const deleteTeachingExperience = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { teachingExperienceId } = req.params;

  const teachingExperience = await teachingExperienceService.deletedTeachingExperience(teacherId, teachingExperienceId);
  res.sendWrapped(teachingExperience, httpStatus.OK);
});

const deleteTeachingExperienceDetail = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { teachingExperienceId, teachingExperienceDetailId } = req.params;

  const teachingExperienceDetail = await teachingExperienceService.deletedTeachingExperienceDetail(
    teacherId,
    teachingExperienceId,
    teachingExperienceDetailId,
  );

  res.sendWrapped(teachingExperienceDetail, httpStatus.OK);
});

const createEducationBackground = catchAsync(async (req, res) => {
  const teacherId = req.user.id;

  multering.options('./src/documents/images/educations', teacherId).single('educationFile')(req, res, async (err) => {
    if (err) {
      res.sendWrapped(err);
    } else {
      const educationBody = await req.body;

      const data = {
        ...educationBody,
        educationFile: req.file.filename,
      };

      const eduBackground = await educationBackgroundService.createEducationBackground(teacherId, data);
      res.sendWrapped(eduBackground, httpStatus.CREATED);
    }
  });
});

const getEducationBackground = catchAsync(async (req, res) => {
  const teacherId = req.user.id;

  const eduBackground = await educationBackgroundService.getEducationBackground(teacherId);
  res.sendWrapped(eduBackground, httpStatus.OK);
});

const deleteEducationBackground = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const { educationBackgroundId } = req.params;

  const educationBackground = await educationBackgroundService.deletedEducationBackground(teacherId, educationBackgroundId);
  res.sendWrapped(educationBackground, httpStatus.OK);
});

const createdFiles = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  let ktp;
  let profile;
  let npwp;

  multering.options('./src/documents/images/ktp', teacherId).single('fileKTP')(req, res, async (err) => {
    if (err) {
      res.sendWrapped(err);
    }
    ktp = req.file;
    res.sendWrapped(ktp, httpStatus.OK);
  });
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
  profileInfo,
  createBasicInfo,
  createPersonalData,
  createTeachingExperience,
  deleteTeachingExperience,
  deleteTeachingExperienceDetail,
  createEducationBackground,
  getEducationBackground,
  deleteEducationBackground,
  createdFiles,
};
