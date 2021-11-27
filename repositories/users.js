const User = require('../models/user');

const createUser = async body => {
  return await User.create(body);
};

const getAllUsers = async () => {
  return await User.find();
};
const getUserById = async userId => {
  return await User.findById(userId);
};
const getUserByEmail = async email => {
  return await User.findOne({ email });
};
const getUserByQuery = async query => {
  return await User.findOne({ ...query });
};
const updateUser = async (userId, body) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { ...body },
    { new: true },
  );
  return user;
};
const addAvatarUrlToUser = async (userId, body) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { ...body },
    { new: true },
  );
  return user;
};

const updateUserPassword = async (_id, password) => {
  return await User.updateOne({ _id }, { password, resetPasswordToken: null });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByQuery,
  updateUser,
  addAvatarUrlToUser,
  updateUserPassword,
};
