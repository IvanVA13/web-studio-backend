const passport = require('passport');
require('../config/passport');

const { httpCode, message, statusCode } = require('./constants.js');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    // const { userId } = req.session;
    const headerAuth = req.get('Authorization');
    let token = null;
    if (headerAuth) {
      token = headerAuth.split(' ')[1];
    }
    if (
      err ||
      !user ||
      token !== user?.token
      // ||
      // !userId ||
      // userId !== user.id
    ) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: statusCode.UNAUTHORIZED,
        code: httpCode.UNAUTHORIZED,
        message: message.NOT_AUTHORIZED,
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
