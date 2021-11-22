const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Role } = require('../models/Role');
const ApiError = require('../utils/ApiError');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');

const getTeacherSubjects = async (opts = {}) => {
  const teacherSubject = await TeacherSubject.findAll(
    {
      ...opts,
    },
  );

  if (teacherSubject.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher not have subject.');

  return teacherSubject;
};

const getTeacherSubjectDetail = async (teacherId, gradeId, subjectId) => {
  const teacherSubject = await TeacherSubject.findOne(
    {
      where: {
        teacherId,
        gradeId,
        subjectId,
      },
    },
  );

  return teacherSubject;
};

const getTeacherSubjectById = async (teacherId, teacherSubjectId, opts = {}) => {
  const teacherSubject = await TeacherSubject.findOne(
    {
      where: {
        id: teacherSubjectId,
        teacherId,
      },
      ...opts,
    },
  );

  return teacherSubject;
};

const getTeacherSubjectAnotherOnId = async (teacherSubjectId, teacherId, gradeId, subjectId) => {
  const teacherSubject = await TeacherSubject.findAll(
    {
      where: {
        id: {
          [Op.ne]: teacherSubjectId,
        },
        teacherId,
        gradeId,
        subjectId,
      },
    },
  );

  return teacherSubject;
};

const createTeacherSubject = async (teacherId, data) => {
  const teacherSubject = await getTeacherSubjectDetail(
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

const updateTeacherSubject = async (teacherSubjectId, teacherId, teacherSubjectBody) => {
  const teacherSubject = await getTeacherSubjectById(
    teacherId,
    teacherSubjectId,
  );

  if (!teacherSubject) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher subject not found.');

  const teacherSubjectAnother = await getTeacherSubjectAnotherOnId(
    teacherSubjectId,
    teacherId,
    teacherSubjectBody.gradeId,
    teacherSubjectBody.subjectId,
  );

  if (teacherSubjectAnother.length > 0) throw new ApiError(httpStatus.CONFLICT, 'Teacher subject is already exists');

  const dataTeacherSubject = {
    gradeId: teacherSubjectBody.gradeId,
    subjectId: teacherSubjectBody.subjectId,
  };

  teacherSubject.update(dataTeacherSubject);

  return teacherSubject;
};

const deleteTeacherSubject = async (teacherSubjectId, teacherId) => {
  const teacherSubject = await getTeacherSubjectById(teacherId, teacherSubjectId);

  if (!teacherSubject) throw new ApiError(httpStatus.NOT_FOUND, 'Teacher subject not found.');

  teacherSubject.destroy();

  return teacherSubject;
};

module.exports = {
  getTeacherSubjects,
  getTeacherSubjectDetail,
  getTeacherSubjectById,
  getTeacherSubjectAnotherOnId,
  createTeacherSubject,
  updateTeacherSubject,
  deleteTeacherSubject,
};
