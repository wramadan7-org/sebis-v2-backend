const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const teacherSubjectService = require('../services/teacherSubjectService');

const createTeacherSubject = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherSubjectBody = req.body;

  const teacherSubject = await teacherSubjectService.createTeacherSubject(
    teacherId,
    teacherSubjectBody,
  );

  res.sendWrapped(teacherSubject, httpStatus.CREATED);
});

const getTeacherSubject = catchAsync(async (req, res) => {
  console.log('get');
});

module.exports = {
  createTeacherSubject,
};
