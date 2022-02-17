const Joi = require('joi');
const {
  httpCode: { BAD_REQUEST },
  message: { NOT_VALID },
} = require('../../../helpers/constants');

const orderCreateSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Zа-яА-Я]+\s*((['-][a-zA-Zа-яА-Я])?[a-zA-Zа-яА-Я]*)*$/)
    .required(),
  phone: Joi.string()
    .regex(/[0-9]+/)
    .min(12)
    .max(12)
    .required(),
  email: Joi.string().email().required(),
  productType: Joi.string()
    .valid('веб-сайт', 'дизайн', 'приложение', 'маркетинг')
    .required(),
  comment: Joi.string().min(3).max(150).required(),
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
