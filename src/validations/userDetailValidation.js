const Joi = require('joi');

const createUserDetail = {
  body: Joi.object().keys({
    userId: Joi.string().max(64).required(),
    birthPlace: Joi.string().max(32).required(),
    birthDate: Joi.date().required(),
    religion: Joi.string().max(12).required(),
    idCardType: Joi.string().max(12).required(),
    idCardNumber: Joi.string().max(32).required(),
    mailingAddress: Joi.string().max(32).required(),
    city: Joi.string().max(32).required(),
    region: Joi.string().max(32).required(),
    postalCode: Joi.string().max(8).required(),
    country: Joi.string().max(32).required(),
    aboutMe: Joi.string().max(32).required(),
  }),
};

module.exports = {
  createUserDetail,
};
