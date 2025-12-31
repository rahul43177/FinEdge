const logger = require("../middleware/logger");

function errorMiddleware(err, req, res, next) {
  let statusCode = 500;
  let message = "Internal server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  // Mongoose duplicate key error
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} already exists`
      : "Duplicate key error";
  }

  // JWT errors
  else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  // Custom application errors (from errorUtils)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log full error stack in development
  if (process.env.NODE_ENV !== "production") {
    logger.error(err.stack || err.message);
  } else {
    // Log minimal info in production
    logger.error(`${statusCode} - ${message}`);
  }

  return res.status(statusCode).json({
    status: false,
    message
  });
}

module.exports = errorMiddleware;
