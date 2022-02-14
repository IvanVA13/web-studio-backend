const Session = require('../models/session');

const findSessionById = async sid => {
  return await Session.findById(sid);
};

const findSessionByIdAndDelete = async sid => {
  return await Session.findByIdAndDelete(sid);
};

const deleteAllSession = async uid => {
  return await Session.deleteMany({ uid });
};

const createSession = async uid => {
  return await Session.create({
    uid,
  });
};

const deleteOneSession = async _id => {
  return Session.deleteOne({ _id });
};

module.exports = {
  findSessionById,
  createSession,
  deleteOneSession,
  findSessionByIdAndDelete,
  deleteAllSession,
};
