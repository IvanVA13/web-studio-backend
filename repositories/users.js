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
const getUserByEmailOrPhone = async (email, phone) => {
  return await User.findOne({ $or: [{ email }, { phone }] });
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
  getUserByEmailOrPhone,
  getUserByQuery,
  updateUser,
  addAvatarUrlToUser,
  updateUserPassword,
};
