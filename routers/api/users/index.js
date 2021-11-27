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
} = require('../../../controllers/users');
const asyncWrapper = require('../../../helpers/asyncWrapper');
const guard = require('../../../helpers/guard');
const uploadImg = require('../../../helpers/upload-img');
const { validUser } = require('./validation');

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
router.get('/verify/:verifyEmailToken', asyncWrapper(verificationWithEmail));
router.post('/verify/:verifyEmailToken', asyncWrapper(verificationWithEmail));
router.patch('/subscribe', guard, asyncWrapper(subscribe));
router.get('/google-auth', asyncWrapper(googleAuth));
router.get('/google-redirect', asyncWrapper(googleRedirect));
router.get('/refresh-token', refresh);

module.exports = router;
