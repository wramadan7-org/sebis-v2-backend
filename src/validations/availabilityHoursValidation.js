const Joi = require('joi');

const createScheduleTime = {
  body: Joi.object().keys({
    dayCode: Joi.number().integer().min(0).max(6)
      .required(),
    timeStart: Joi.string().required(),
  }),
};

const getScheduleTimeById = {
  params: Joi.object().keys({
    availabilityHoursId: Joi.string().required(),
  }),
};

module.exports = {
  createScheduleTime,
  getScheduleTimeById,
};
