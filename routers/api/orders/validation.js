const Joi = require('joi');
const {
  httpCode: { BAD_REQUEST },
  message: { NOT_VALID },
} = require('../../../helpers/constants');

const orderCreateSchema = Joi.object({
  date: Joi.date(),
  name: Joi.string().min(3).max(40),
  comment: Joi.string().min(3).max(150),
  status: Joi.string().valid('new', 'done', 'cancel').optional(),
});

const orderUpdateSchema = Joi.object({
  status: Joi.string().valid('new', 'done', 'cancel').required(),
});

const validate = async (schema, value, errMessage, next) => {
  try {
    await schema.validateAsync(value);
    next();
  } catch (error) {
    next({
      status: BAD_REQUEST,
      message: errMessage,
    });
  }
};

module.exports = {
  validNewOrder: (req, _, next) => {
    return validate(orderCreateSchema, req.body, NOT_VALID, next);
  },
  validUpdateOrder: (req, _, next) => {
    return validate(orderUpdateSchema, req.body, NOT_VALID, next);
  },
};
