const { Op, Transaction } = require('sequelize');
const { School } = require('../models/School');

const createNewSchool = async (schoolBody) => School.create(schoolBody);

const getSchoolById = async (schoolId, opts = {}) => {
  const school = School.findOne({
    where: {
      id: schoolId,
    },
    ...opts,
  });
  return school;
};

const getSchoolByName = async (schoolName, opts = {}) => {
  const school = School.findAndCountAll({
    where: {
      [Op.like]: `%${schoolName}%`,
    },
    ...opts,
  });
  return school;
};

const getSchoolByAddress = async (schoolAddress, opts = {}) => {
  const school = School.findAndCountAll({
    where: {
      [Op.like]: `%${schoolAddress}%`,
    },
    ...opts,
  });
};

module.exports = {
  createNewSchool,
  getSchoolById,
  getSchoolByName,
  getSchoolByAddress,
};
