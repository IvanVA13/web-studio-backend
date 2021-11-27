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
  NOT_FOUND: 'Page not found',
  USER_NOT_REG: 'User not found',
  BAD_EMAIL_OR_PASSWORD: 'Email or password is wrong',
  NOT_AUTHORIZED: 'Not authorized',
  CONFLICT: 'Email in use',
  TOO_MANY_REQUESTS: 'Too mach requests, try later...',
  DB_CONNECT_SUCCESS: 'Database connection successful',
  DB_CONNECT_TERMINATED: 'Connection to database terminated',
  DB_CONNECT_ERROR: 'Error connection to db:',
  VERIFY_SUCCESS: 'Verification successful',
  VERIFY_RESEND: 'Verification email sent',
  VERIFIED: 'Your email has already been verified',
  NOT_VALID: 'missing required fields',
  WRONG_FORMAT: 'Wrong format!',
  ORDER_NOT_FOUND: 'Order not found',
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

module.exports = {
  httpCode,
  statusCode,
  message,
  userRole,
  orderStatus,
  company,
};
