const Joi = require('joi');

const basicInfo = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    gender: Joi.equal('male', 'female'),
    phoneNumber: Joi.string().max(14),
    religion: Joi.string().lowercase(),
    birthPlace: Joi.string().lowercase().max(32),
    birthDate: Joi.date(),
  }),
};

const personalData = {
  body: Joi.object().keys({
    idCardType: Joi.string().lowercase().max(12),
    idCardNumber: Joi.string().max(32),
    mailingAddress: Joi.string().max(32), // alamat domisili
    city: Joi.string().lowercase().max(32),
    region: Joi.string().lowercase().max(32), // provinsi
    postalCode: Joi.string().max(8),
    country: Joi.string().lowercase().max(32), // kota
    aboutMe: Joi.string().max(32),
  }),
};

module.exports = {
  basicInfo,
  personalData,
};
