const { School } = require('../models/School');

const createNewSchool = async (schoolBody) => School.create(schoolBody);

module.exports = {
  createNewSchool,
};
