const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();
const { JWT_SECRET_KEY } = process.env;
const { getUserById } = require('../repositories/users');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await getUserById(payload.id);
      if (!user) {
        return done(new Error('User not found'));
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      if (err) {
        done(err, false);
      }
    }
  }),
);
