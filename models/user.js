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
    lastName: {
      type: String,
      default: 'user-last-name',
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
    },
    role: {
      type: String,
      default: 'user',
    },
    avatarUrl: {
      type: String,
      default: function () {
        if (this.sex === 'male') {
          return 'https://res.cloudinary.com/djp4ztej6/image/upload/c_scale,w_250/v1640036716/CloudAvatar/users-avatars/male.png';
        }
        if (this.sex === 'female') {
          return 'https://res.cloudinary.com/djp4ztej6/image/upload/c_scale,w_250/v1640033202/CloudAvatar/users-avatars/female.png';
        }
      },
    },
    idCloudAvatar: {
      type: String,
      default: function () {
        if (this.sex === 'male') {
          return 'male';
        }
        if (this.sex === 'female') {
          return 'female';
        }
      },
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
    resetPasswordToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true },
);

const passCrypt = async function (next) {
  const salt = await bcrypt.genSalt(9);
  if (this.isModified && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this?._update?.password) {
    this._update.password = await bcrypt.hash(this._update.password, salt);
  }
  next();
};

const isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

user.pre('save', passCrypt);
user.pre('updateOne', passCrypt);
user.methods.isValidPassword = isValidPassword;
const User = model('user', user);
module.exports = User;
