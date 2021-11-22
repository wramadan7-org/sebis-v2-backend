const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const teacherSubjectService = require('../services/teacherSubjectService');
const ApiError = require('../utils/ApiError');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');

const createTeacherSubject = catchAsync(async (req, res) => {
  const teacherId = req.user.id;
  const teacherSubjectBody = req.body;

  const teacherSubject = await teacherSubjectService.createTeacherSubject(
    teacherId,
    teacherSubjectBody,
  );

  res.sendWrapped(teacherSubject, httpStatus.CREATED);
});

const getTeacherSubjectAll = catchAsync(async (req, res) => {
  const teacherSubject = await teacherSubjectService.getTeacherSubjects(
    {
      include: [
        {
          model: Subject,
        },
        {
          model: Grade,
          include: [
            {
              model: GradeGroup,
              include: [
                {
                  model: Curriculum,
                },
              ],
            },
          ],
        },
      ],
    }
  );

  if (teacherSubject.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher subject empty');

  res.sendWrapped(teacherSubject, httpStatus.OK);
});

module.exports = {
  createTeacherSubject,
  getTeacherSubjectAll,
};
