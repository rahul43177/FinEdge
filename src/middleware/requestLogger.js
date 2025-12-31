const logger = require("./logger");
const getTimestamp = require("../utils/helper").getTimestamp;

function requestLogger(req, res, next) {
const timestamp = getTimestamp();
  console.log(`${timestamp} | ${req.method} | ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
