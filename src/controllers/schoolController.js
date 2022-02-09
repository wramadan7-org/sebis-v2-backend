const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  createNewSchool,
  getSchoolByName,
} = require('../services/schoolService');

const createSchool = catchAsync(async (req, res) => {
  const schoolBody = req.body;
  const school = await createNewSchool(schoolBody);
  res.sendWrapped(school, httpStatus.CREATED);
});

const getSchool = catchAsync(async (req, res) => {
  const school = await getSchoolByName(req.query.scoolName);
  res.sendWrapped(school, httpStatus.OK);
});
module.exports = {
  createSchool,
  getSchool,
};
