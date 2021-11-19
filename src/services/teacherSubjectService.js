const httpStatus = require('http-status');
const { Role } = require('../models/Role');
const ApiError = require('../utils/ApiError');
const { TeacherSubject } = require('../models/TeacherSubject');

const getTeacherSubjects = async () => {
  const teacherSubject = await TeacherSubject.findAll();

  if (teacherSubject.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not have subject.');

  return teacherSubject;
};

const checkerTeacherSubject = async (teacherId, gradeId, subjectId) => {
  const teacherSubject = await TeacherSubject.findOne(
    {
      teacherId,
      gradeId,
      subjectId,
    },
  );

  return teacherSubject;
};

const createTeacherSubject = async (teacherId, data) => {
  const teacherSubject = await checkerTeacherSubject(
    teacherId,
    data.gradeId,
    data.subjectId,
  );

  if (teacherSubject) throw new ApiError(httpStatus.CONFLICT, 'Teacher have that subject.');

  const dataSubject = {
    teacherId,
    ...data,
  };

  const created = await TeacherSubject.create(dataSubject);

  return created;
};

module.exports = {
  getTeacherSubjects,
  checkerTeacherSubject,
  createTeacherSubject,
};
