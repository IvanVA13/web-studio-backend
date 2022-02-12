const { Conflict, Unauthorized, NotFound, BadRequest } = require('http-errors');
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const axios = require('axios');
const queryString = require('query-string');

const { httpCode, statusCode, message } = require('../helpers/constants');
const {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  getUserByQuery,
  updateUserPassword,
} = require('../repositories/users');
const UploadAvatarService = require('../services/cloud-avatar');
const { SenderEmailService } = require('../services/email-gen');
const { createSendGridSender } = require('../services/email-senders');
const { verifyEmailTemp, resetPasswordTemp } = require('../helpers/emailTemp');
const Session = require('../models/session');

require('dotenv').config();
const {
  JWT_SECRET_KEY,
  NODE_ENV,
  BASE_URL,
  BASE_URL_FRONT,
  CLIENT_ID_GOOGLE_AUTH,
  CLIENT_SECRET_GOOGLE_AUTH,
  JWT_ACCESS_EXPIRE_TIME,
  JWT_REFRESH_EXPIRE_TIME,
} = process.env;
const verifyEmail = new SenderEmailService(NODE_ENV, createSendGridSender);
const uploads = new UploadAvatarService();

const register = async (req, res) => {
  const { body } = req;
  const { email: reqEmail } = body;
  const user = await getUserByEmail(reqEmail);
  if (user) {
    throw new Conflict(message.CONFLICT);
  }
  const verifyEmailToken = uuid();
  const { email, lastName, firstName } = await createUser({
    ...body,
    verifyEmailToken,
  });
  await verifyEmail.sendEmail(email, {
    userName: `${lastName} ${firstName}`,
    link: `verify/${verifyEmailToken}`,
    ...verifyEmailTemp,
  });
  return res.status(httpCode.CREATED).json({
    status: statusCode.SUCCESS,
    code: httpCode.CREATED,
    data: {
      email,
    },
  });
};

const login = async (req, res) => {
  const { body } = req;
  const { email: reqEmail, password } = body;
  const user = await getUserByEmail(reqEmail);
  if (!user) {
    throw new NotFound(message.USER_NOT_REG);
  }

  const {
    id: uid,
    verify,
    firstName,
    lastName,
    sex,
    email,
    role,
    avatarUrl,
  } = user;
  const validPass = await user?.isValidPassword(password);
  if (!validPass || !verify) {
    throw new Unauthorized(message.NOT_AUTHORIZED);
  }
  const { _id: sid } = await Session.create({
    uid,
  });

  const payload = {
    uid,
    sid,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_ACCESS_EXPIRE_TIME,
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_REFRESH_EXPIRE_TIME,
  });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    token,
    refreshToken,
    sid,
    data: {
      firstName,
      lastName,
      sex,
      email,
      role,
      avatarUrl,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.session;
  await Session.deleteOne({ _id });
  req.user = null;
  req.session = null;
  return res.status(httpCode.NO_CONTENT).json({});
};

const googleAuth = async (_, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: CLIENT_ID_GOOGLE_AUTH,
    redirect_uri: `${BASE_URL}/api/users/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  );
};

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;
  const {
    data: { access_token },
  } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: CLIENT_ID_GOOGLE_AUTH,
      client_secret: CLIENT_SECRET_GOOGLE_AUTH,
      redirect_uri: `${BASE_URL}/api/users/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });
  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const {
    data: { email, picture, id: userGoogleId, given_name, family_name },
  } = userData;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    await createUser({
      firstName: given_name,
      lastName: family_name,
      email,
      password: userGoogleId,
      avatarUrl: picture,
      verify: true,
    });
  }
  const createdUser = await getUserByEmail(email);
  const { id: uid } = existingUser ? existingUser : createdUser;

  const { _id: sid } = await Session.create({
    uid,
  });

  const payload = {
    uid,
    sid,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_ACCESS_EXPIRE_TIME,
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_REFRESH_EXPIRE_TIME,
  });
  return res.redirect(
    `${BASE_URL_FRONT}/login?token=${token}&refreshToken=${refreshToken}&sid=${sid}
    `,
  );
};

const verificationWithEmail = async (req, res) => {
  const {
    params: { verifyEmailToken },
    body: { email: emailReq },
  } = req;
  if (verifyEmailToken) {
    const user = await getUserByQuery({ verifyEmailToken });
    if (!user) {
      throw new NotFound(`${message.VERIFIED} or ${message.USER_NOT_REG}`);
    }
    const { _id, verifyEmailToken: verifyToken } = user;
    if (verifyEmailToken === verifyToken) {
      await updateUser(_id, {
        verifyEmailToken: null,
        verify: true,
      });
      return res.json({
        status: statusCode.SUCCESS,
        code: httpCode.OK,
        message: message.VERIFY_SUCCESS,
      });
    }
  }

  if (emailReq) {
    const user = await getUserByEmail(emailReq);
    if (!user || user.verify) {
      throw new NotFound(`${message.VERIFIED} or ${message.USER_NOT_REG}`);
    }
    const { firstName, lastName, verifyEmailToken } = user;
    await verifyEmail.sendEmail(emailReq, {
      userName: `${lastName} ${firstName}`,
      link: `api/users/verify/${verifyEmailToken}`,
      ...verifyEmailTemp,
    });

    return res.json({
      status: statusCode.SUCCESS,
      code: httpCode.OK,
      message: message.VERIFY_RESEND,
    });
  }
  return res.status(httpCode.BAD_REQUEST).json({
    statusCode: statusCode.ERR,
    message: message.NOT_VALID,
  });
};

const refresh = async (req, res) => {
  const authorizationHeader = req.get('Authorization');
  if (!authorizationHeader) {
    return res.status(httpCode.BAD_REQUEST).json({
      statusCode: statusCode.ERR,
      message: message.NOT_VALID,
    });
  }
  const activeSession = await Session.findById(req.params.sid);
  if (!activeSession) {
    throw new NotFound(message.SESSION_NOT_FOUND);
  }
  const refreshToken = await authorizationHeader.replace('Bearer ', '');
  let payload;
  try {
    payload = await jwt.verify(refreshToken, JWT_SECRET_KEY);
  } catch ({ message }) {
    await Session.findByIdAndDelete(req.params.sid);
    return res.status(httpCode.UNAUTHORIZED).json({
      statusCode: statusCode.ERR,
      message,
    });
  }
  const user = await getUserById(payload.uid);
  const session = await Session.findById(payload.sid);
  if (!user) {
    throw new NotFound(message.USER_NOT_REG);
  }
  const { id: uid } = user;
  if (!session) {
    throw new NotFound(message.SESSION_NOT_FOUND);
  }
  await Session.findByIdAndDelete(payload.sid);
  const { _id: sid } = await Session.create({
    uid,
  });
  const newAccessToken = jwt.sign({ uid, sid }, JWT_SECRET_KEY, {
    expiresIn: JWT_ACCESS_EXPIRE_TIME,
  });
  const newRefreshToken = jwt.sign({ uid, sid }, JWT_SECRET_KEY, {
    expiresIn: JWT_REFRESH_EXPIRE_TIME,
  });
  return res.json({
    statusCode: statusCode.SUCCESS,
    newAccessToken,
    newRefreshToken,
    sid,
  });
};

const current = async (req, res) => {
  const { email, firstName, lastName, sex, role, avatarUrl } = req.user;
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      firstName,
      lastName,
      sex,
      email,
      role,
      avatarUrl,
    },
  });
};

const avatars = async (req, res) => {
  if (!req.file) {
    throw new BadRequest(message.NO_PATH_FILE);
  }
  const { path } = req.file;
  const { id, idCloudAvatar: idAvatar } = req.user;
  const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(path, idAvatar);
  await fs.unlink(path);
  await updateUser(id, { avatarUrl, idCloudAvatar });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      avatarUrl,
    },
  });
};

const changeFirstName = async (req, res) => {
  const {
    user: { id },
    body: { firstName },
  } = req;
  const { firstName: newFirstName } = await updateUser(id, { firstName });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      newFirstName,
    },
  });
};

const changeLastName = async (req, res) => {
  const {
    user: { id },
    body: { lastName },
  } = req;
  const { lastName: newLastName } = await updateUser(id, { lastName });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      newLastName,
    },
  });
};

const changeEmail = async (req, res) => {
  const {
    user: { id },
    body: { email },
  } = req;
  const { email: newEmail } = await updateUser(id, { email });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      newEmail,
    },
  });
};

const changePassword = async (req, res) => {
  const {
    user: { id },
    body: { password },
  } = req;
  await updateUserPassword(id, password);
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    message: message.PASSWORD_RESET_OK,
  });
};

const changeSex = async (req, res) => {
  const {
    user: { id },
    body: { sex },
  } = req;
  const { sex: newSex } = await updateUser(id, { sex });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: {
      newSex,
    },
  });
};

const subscribe = async (req, res) => {
  const { email, subscribe } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    {
      throw new NotFound(`${message.USER_NOT_REG}`);
    }
  }

  const { _id } = user;
  const { subscriptionToNewsletter } = await updateUser(_id, {
    subscriptionToNewsletter: subscribe,
  });
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    data: { subscriptionToNewsletter },
  });
};

const forgotten = async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new NotFound(message.USER_NOT_REG);
  }
  const { id, lastName, firstName } = user;
  const resetPasswordToken = uuid();

  await updateUser(id, { resetPasswordToken });
  await verifyEmail.sendEmail(email, {
    userName: `${lastName} ${firstName}`,
    link: `users/verify/${resetPasswordToken}`,
    ...resetPasswordTemp,
  });

  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
  });
};

const resetPassword = async (req, res) => {
  const {
    body: { password },
    params: { resetPasswordToken },
  } = req;
  const user = await getUserByQuery({ resetPasswordToken });
  if (!user) {
    throw new NotFound(message.USER_NOT_REG);
  }
  await updateUserPassword(user.id, password);
  return res.json({
    status: statusCode.SUCCESS,
    code: httpCode.OK,
    message: message.PASSWORD_RESET_OK,
  });
};

module.exports = {
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
};
