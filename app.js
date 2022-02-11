const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const boolParser = require('express-query-boolean');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();
const { BASE_URL_FRONT } = process.env;
const router = require('./routers/api');
const {
  httpCode: { NOT_FOUND, INTERNAL_SERVER_ERROR },
  message,
  reqLimiterAPI,
} = require('./helpers/constants');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.options('*', cors());
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 5000 }));
app.use(boolParser());
app.use('/api', rateLimit(reqLimiterAPI));
app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
