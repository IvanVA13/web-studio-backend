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
  validationEmail,
  validationPassword,
  validationFirstName,
  validationLastName,
  validationSex,
  validationSubscribe,
} = require('./validation');

const router = express.Router();

router.post('/register', validUser, asyncWrapper(register));
router.post('/login', validUser, asyncWrapper(login));
router.get('/logout', guard, asyncWrapper(logout));
router.get('/google-auth', asyncWrapper(googleAuth));
router.get('/google-redirect', asyncWrapper(googleRedirect));
router.get('/verify/:verifyEmailToken', asyncWrapper(verificationWithEmail));
router.post('/verify', validationEmail, asyncWrapper(verificationWithEmail));
router.get('/refresh-token/:sid', asyncWrapper(refresh));

router.get('/current', guard, asyncWrapper(current));
router.patch(
  '/avatar',
  guard,
  uploadImg.single('avatar'),
  asyncWrapper(avatars),
);
router.patch(
  '/first-name',
  guard,
  validationFirstName,
  asyncWrapper(changeFirstName),
);
router.patch(
  '/last-name',
  guard,
  validationLastName,
  asyncWrapper(changeLastName),
);
router.patch('/email', guard, validationEmail, asyncWrapper(changeEmail));
router.patch(
  '/password',
  guard,
  validationPassword,
  asyncWrapper(changePassword),
);
router.patch('/sex', guard, validationSex, asyncWrapper(changeSex));
router.patch('/subscribe', guard, validationSubscribe, asyncWrapper(subscribe));
router.post('/forgotten', validationEmail, asyncWrapper(forgotten));
router.post(
  '/reset-password/:resetPasswordToken',
  validationPassword,
  asyncWrapper(resetPassword),
);

module.exports = router;
