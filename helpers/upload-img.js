const multer = require('multer');

require('dotenv').config();
const { UPLOAD } = process.env;

const {
  httpCode: { BAD_REQUEST },
  message: { WRONG_FORMAT },
} = require('./constants');

const uniquePartOfName = `${Math.random() * 1000000}`;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, UPLOAD);
  },
  filename: (req, file, cb) => {
    const {
      user: { id: userId },
    } = req;
    cb(null, `${userId}~${uniquePartOfName}~${file.originalname}`);
  },
  limits: {
    fileSize: 2 * 1048 * 1048,
  },
});

const uploadImg = multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.includes('image')) {
      const err = new Error(WRONG_FORMAT);
      err.status = BAD_REQUEST;
      cb(err);
    }
    cb(null, true);
    return;
  },
});

module.exports = uploadImg;
