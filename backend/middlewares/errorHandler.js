const logger = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack, path: req.path });

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendError(res, 'File size exceeds 5MB limit.', 413);
  }

  if (err.message === 'Only PDF files are allowed.') {
    return sendError(res, err.message, 415);
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return sendError(res, 'Validation failed', 422, messages);
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    return sendError(res, 'Invalid resource ID format.', 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token has expired.', 401);
  }

  // Default
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode < 500 ? err.message : 'Internal server error.';
  return sendError(res, message, statusCode);
};

const notFound = (req, res) => {
  return sendError(res, `Route ${req.method} ${req.originalUrl} not found.`, 404);
};

module.exports = { errorHandler, notFound };
