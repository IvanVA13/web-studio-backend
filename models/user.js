const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const user = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    firstName: {
      type: String,
      default: 'user-name',
    },
    LastName: {
      type: String,
      default: 'user-last-name',
    },
    role: {
      type: String,
      default: 'user',
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    idCloudAvatar: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyEmailToken: {
      type: String,
      default: null,
    },
    verifySmsCode: {
      type: String,
      default: null,
    },
    subscriptionToNewsletter: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const passCrypt = async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(9);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
};

const isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

user.pre('save', passCrypt);
user.methods.isValidPassword = isValidPassword;
const User = model('user', user);
module.exports = User;
