const express = require('express');

const {
  register,
  login,
  logout,
  refresh,
  current,
  avatars,
  verificationWithEmail,
  subscribe,
  googleAuth,
  googleRedirect,
  forgotten,
  resetPassword,
  changeFirstName,
  changeLastName,
  changeEmail,
  changePassword,
  changeSex,
} = require('../../../controllers/users');
const asyncWrapper = require('../../../helpers/asyncWrapper');
const guard = require('../../../helpers/guard');
const uploadImg = require('../../../helpers/upload-img');
const {
  validUser,
  validationForgotten,
  validationResetPassword,
} = require('./validation');

const router = express.Router();

router.post('/register', validUser, asyncWrapper(register));
router.post('/login', validUser, asyncWrapper(login));
router.get('/logout', guard, asyncWrapper(logout));
router.get('/current', guard, asyncWrapper(current));
router.patch(
  '/avatar',
  guard,
  uploadImg.single('avatar'),
  asyncWrapper(avatars),
);
router.patch('/first-name', guard, asyncWrapper(changeFirstName));
router.patch('/last-name', guard, asyncWrapper(changeLastName));
router.patch('/email', guard, asyncWrapper(changeEmail));
router.patch('/password', guard, asyncWrapper(changePassword));
router.patch('/sex', guard, asyncWrapper(changeSex));
router.get('/verify/:verifyEmailToken', asyncWrapper(verificationWithEmail));
router.post('/verify', asyncWrapper(verificationWithEmail));
router.patch('/subscribe', guard, asyncWrapper(subscribe));
router.get('/google-auth', asyncWrapper(googleAuth));
router.get('/google-redirect', asyncWrapper(googleRedirect));
router.get('/refresh-token/:sid', asyncWrapper(refresh));
router.post('/forgotten', validationForgotten, asyncWrapper(forgotten));
router.post(
  '/reset-password/:resetPasswordToken',
  validationResetPassword,
  asyncWrapper(resetPassword),
);

module.exports = router;
