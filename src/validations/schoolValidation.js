const Joi = require('joi');

const createSchool = {
  body: Joi.object().keys({
    schoolName: Joi.string().max(32).required(),
  }),
};

module.exports = {
  createSchool,
};
