const httpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const company = {
  name: 'Web Studio',
};

const statusCode = {
  SUCCESS: 'success',
  ERR: 'error',
};

const message = {
  DB_CONNECT_SUCCESS: 'Database connection successful',
  VERIFY_SUCCESS: 'Verification successful',
  VERIFY_RESEND: 'Verification email sent',
  PASSWORD_RESET_OK: 'Password reset success',
  NOT_VALID: 'missing required fields',
  BAD_EMAIL_OR_PASSWORD: 'Email or password is wrong',
  WRONG_FORMAT: 'Wrong format!',
  NO_PATH_FILE: 'Missing path to file',
  NOT_AUTHORIZED: 'Not authorized',
  NOT_FOUND: 'Page not found',
  USER_NOT_REG: 'User not found',
  SESSION_NOT_FOUND: 'Invalid session',
  VERIFIED: 'Your email has already been verified',
  ORDER_NOT_FOUND: 'Order not found',
  CONFLICT: 'Email or phone in use',
  TOO_MANY_REQUESTS: 'Too mach requests, try later...',
  DB_CONNECT_TERMINATED: 'Connection to database terminated',
  DB_CONNECT_ERROR: 'Error connection to db:',
};

const userRole = {
  USER: 'user',
  MANAGER: 'manager',
};

const orderStatus = {
  NEW: 'new',
  CANCEL: 'cancel',
  DONE: 'done',
};

const reqLimiterAPI = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  handler: (_, __, ___) => {
    throw new TooManyRequests(message.TOO_MANY_REQUESTS);
  },
};

module.exports = {
  httpCode,
  statusCode,
  message,
  userRole,
  orderStatus,
  company,
  reqLimiterAPI,
};
