const mongoose = require('mongoose');
const { message } = require('../helpers/constants');

require('dotenv').config();
const { DB_HOST } = process.env;

const db = mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () =>
  console.log(message.DB_CONNECT_SUCCESS),
);

mongoose.connection.on('disconnected', () =>
  console.log(message.DB_CONNECT_TERMINATED),
);

mongoose.connection.on('error', e => {
  console.log(`${message.DB_CONNECT_ERROR} ${e.message}`);
  process.exit(1);
});

process.on('SIGINT', async () => {
  const client = await db;
  client.close();
  process.exit(1);
});

module.exports = db;
