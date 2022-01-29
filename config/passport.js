const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();
const { JWT_SECRET_KEY } = process.env;
const { getUserById } = require('../repositories/users');
const Session = require('../models/session');
const { message } = require('../helpers/constants');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await getUserById(payload.uid);
      const session = await Session.findById(payload.sid);
      if (!user) {
        return done(new Error(message.USER_NOT_REG));
      }
      if (!session) {
        return done(new Error(message.SESSION_NOT_FOUND));
      }
      return done(null, user, session);
    } catch (err) {
      if (err) {
        done(err, false);
      }
    }
  }),
);
