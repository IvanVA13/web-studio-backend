const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const boolParser = require('express-query-boolean');
const rateLimit = require('express-rate-limit');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const router = require('./routers/api');
const {
  httpCode: { NOT_FOUND, INTERNAL_SERVER_ERROR },
  message,
} = require('./helpers/constants');
// const { sessionOpt } = require('./helpers/sessions');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 5000 }));
app.use(boolParser());
// app.use(sessions(sessionOpt));
app.use(cookieParser());
// app.use('/api', rateLimit('rules'));
app.use('/api', router);

app.use((_, res) => {
  res.status(NOT_FOUND).json({ message: message.NOT_FOUND });
});

app.use((err, _, res, __) => {
  const status = err.status || INTERNAL_SERVER_ERROR;
  res.status(status).json({ message: err.message });
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
