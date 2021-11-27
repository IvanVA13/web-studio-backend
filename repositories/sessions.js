const Session = require('../models/session');

const findSessionById = async sid => {
  return await Session.findById(sid);
};

module.exports = { findSessionById };
