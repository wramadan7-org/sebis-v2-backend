const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { createNewSchool } = require('../services/schoolService');

const createSchool = catchAsync(async (req, res) => {
  const schoolBody = req.body;
  const school = await createNewSchool(schoolBody);
  res.sendWrapped(school, httpStatus.CREATED);
});

module.exports = {
  createSchool,
};
