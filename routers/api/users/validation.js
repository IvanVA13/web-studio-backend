const Joi = require('joi');
const {
  httpCode: { BAD_REQUEST },
  message: { NOT_VALID },
} = require('../../../helpers/constants');

const userValidationSchema = Joi.object({
  firstName: Joi.string().max(40).optional(),
  LastName: Joi.string().max(40).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  role: Joi.string().optional(),
  token: Joi.string().optional(),
  verify: Joi.string().optional(),
  verifyEmailToken: Joi.string().optional(),
  verifySmsCode: Joi.string().optional(),
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
};
