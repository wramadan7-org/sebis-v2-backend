const Joi = require('joi');

const createBank = {
  body: Joi.object().keys({
    temporaryIdentityId: Joi.string().default('-'),
    bankName: Joi.string().uppercase().required(),
    bankNumber: Joi.number().min(10).required(),
    bankOwnerName: Joi.string().required(),
  }),
};

module.exports = {
  createBank,
};
