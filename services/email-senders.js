const sgMail = require('@sendgrid/mail');
const {
  company: { name },
} = require('../helpers/constants');

require('dotenv').config();

const { EMAIL_SENDING_LOGIN, SENDGRID_API_KEY } = process.env;

const createSendGridSender = async bodyMsg => {
  sgMail.setApiKey(SENDGRID_API_KEY);
  return await sgMail.send({
    ...bodyMsg,
    from: `${name} <${EMAIL_SENDING_LOGIN}>`,
  });
};

module.exports = { createSendGridSender };
