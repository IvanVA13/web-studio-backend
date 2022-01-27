// const sessions = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const { DB_HOST, SESSION_SECRET_KEY } = process.env;

const time = 3600;

const sessionOpt = {
  secret: SESSION_SECRET_KEY,
  name: 'session',
  saveUninitialized: true,
  cookie: { maxAge: time * 1000 },
  resave: false,
  store: MongoStore.create({
    mongoUrl: DB_HOST,
    touchAfter: time,
    mongoOptions: { useUnifiedTopology: true },
  }),
};

module.exports = sessionOpt;
