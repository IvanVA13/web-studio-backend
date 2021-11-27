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
const getUserByVerifyEmailToken = async verifyEmailToken => {
  return await User.findOne({ verifyEmailToken });
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByVerifyEmailToken,
  updateUser,
  addAvatarUrlToUser,
};
