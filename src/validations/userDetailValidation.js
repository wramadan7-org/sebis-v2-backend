const Joi = require('joi');

const createUserDetail = {
  body: Joi.object().keys({
    birthPlace: Joi.string().uppercase().max(32).required(),
    birthDate: Joi.date().required(),
    religion: Joi.string().uppercase().max(12).required(),
    idCardType: Joi.string().uppercase().max(12).required(),
    idCardNumber: Joi.string().max(32).required(),
    mailingAddress: Joi.string().max(32).required(),
    city: Joi.string().uppercase().max(32).required(),
    region: Joi.string().uppercase().max(32).required(),
    postalCode: Joi.string().max(8).required(),
    country: Joi.string().uppercase().max(32).required(),
    aboutMe: Joi.string().max(32).required(),
  }),
};

const updateUserDetail = {
  body: Joi.object().keys({
    birthPlace: Joi.string().uppercase().max(32),
    birthDate: Joi.date(),
    religion: Joi.string().uppercase().max(12),
    idCardType: Joi.string().uppercase().max(12),
    idCardNumber: Joi.string().max(32),
    mailingAddress: Joi.string().max(32),
    city: Joi.string().uppercase().max(32),
    region: Joi.string().uppercase().max(32),
    postalCode: Joi.string().max(8),
    country: Joi.string().uppercase().max(32),
    aboutMe: Joi.string().max(32),
  }),
};

module.exports = {
  createUserDetail,
  updateUserDetail,
};
