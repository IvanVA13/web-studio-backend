const Joi = require('joi');
const {
  httpCode: { BAD_REQUEST },
  message: { NOT_VALID },
} = require('../../../helpers/constants');

const userValidationSchema = Joi.object({
  firstName: Joi.string().max(40).optional(),
  lastName: Joi.string().max(40).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  sex: Joi.string().valid('male', 'female').optional(),
  role: Joi.string().optional(),
  token: Joi.string().optional(),
  verify: Joi.string().optional(),
  verifyEmailToken: Joi.string().optional(),
  verifySmsCode: Joi.string().optional(),
  subscriptionToNewsletter: Joi.string().optional(),
  resetPasswordToken: Joi.string().optional(),
});

const forgottenValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordValidationSchema = Joi.object({
  password: Joi.string().min(6).max(50).required(),
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
  validUser: (req, _, next) => {
    return validate(userValidationSchema, req.body, NOT_VALID, next);
  },
  validationForgotten: (req, _, next) => {
    return validate(forgottenValidationSchema, req.body, NOT_VALID, next);
  },
  validationResetPassword: (req, _, next) => {
    return validate(resetPasswordValidationSchema, req.body, NOT_VALID, next);
  },
};
