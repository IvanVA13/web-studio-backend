const Joi = require('joi');
const {
  httpCode: { BAD_REQUEST },
  message: { NOT_VALID },
} = require('../../../helpers/constants');

const userRegValidationSchema = Joi.object({
  firstName: Joi.string().max(40).optional(),
  lastName: Joi.string().max(40).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  phone: Joi.string()
    .regex(/[0-9]+/)
    .min(12)
    .max(12)
    .required(),
  sex: Joi.string().valid('male', 'female').optional(),
  role: Joi.string().optional(),
  token: Joi.string().optional(),
  verify: Joi.string().optional(),
  verifyEmailToken: Joi.string().optional(),
  verifySmsCode: Joi.string().optional(),
  subscriptionToNewsletter: Joi.string().optional(),
  resetPasswordToken: Joi.string().optional(),
});

const userLoginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

const emailValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});
const phoneValidationSchema = Joi.object({
  phone: Joi.string()
    .regex(/[0-9]+/)
    .min(12)
    .max(12)
    .required(),
});

const passwordValidationSchema = Joi.object({
  password: Joi.string().min(6).max(50).required(),
});

const firstNameValidationSchema = Joi.object({
  firstName: Joi.string().required(),
});

const lastNameValidationSchema = Joi.object({
  lastName: Joi.string().required(),
});

const sexValidationSchema = Joi.object({
  sex: Joi.string().required(),
});

const subscribeValidationSchema = Joi.object({
  email: Joi.string().required(),
  subscribe: Joi.boolean().required(),
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
  validationRegUser: (req, _, next) => {
    return validate(userRegValidationSchema, req.body, NOT_VALID, next);
  },
  validationLoginUser: (req, _, next) => {
    return validate(userLoginValidationSchema, req.body, NOT_VALID, next);
  },
  validationEmail: (req, _, next) => {
    return validate(emailValidationSchema, req.body, NOT_VALID, next);
  },
  validationPhone: (req, _, next) => {
    return validate(phoneValidationSchema, req.body, NOT_VALID, next);
  },
  validationPassword: (req, _, next) => {
    return validate(passwordValidationSchema, req.body, NOT_VALID, next);
  },

  validationFirstName: (req, _, next) => {
    return validate(firstNameValidationSchema, req.body, NOT_VALID, next);
  },
  validationLastName: (req, _, next) => {
    return validate(lastNameValidationSchema, req.body, NOT_VALID, next);
  },
  validationSex: (req, _, next) => {
    return validate(sexValidationSchema, req.body, NOT_VALID, next);
  },
  validationSubscribe: (req, _, next) => {
    return validate(subscribeValidationSchema, req.body, NOT_VALID, next);
  },
};
