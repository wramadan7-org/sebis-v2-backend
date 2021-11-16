const httpStatus = require('http-status');
const { Grade } = require('../models/Grade');
const ApiError = require('../utils/ApiError');

const getGradeById = async (gradeId, opts = {}) => {
  const grade = Grade.findOne({
    where: {
      id: gradeId,
    },
  });
  return grade;
};
module.exports = {};
