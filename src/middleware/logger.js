const getTimestamp = require("../utils/helper").getTimestamp;

const LOG_LEVEL = process.env.LOG_LEVEL || "INFO";

const levels = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4
};

const colors = {
  DEBUG: "\x1b[36m", // cyan
  INFO: "\x1b[32m",  // green
  WARN: "\x1b[33m",  // yellow
  ERROR: "\x1b[31m", // red
  RESET: "\x1b[0m"
};


function shouldLog(level) {
  return levels[level] >= levels[LOG_LEVEL];
}

function log(level, message) {
  if (!shouldLog(level)) return;

  const timestamp = getTimestamp();
  const color = colors[level] || "";
  const reset = colors.RESET;

  console.log(
    `${color}${timestamp} | ${level} | ${message}${reset}`
  );
}

function debug(message) {
  log("DEBUG", message);
}

function info(message) {
  log("INFO", message);
}

function warn(message) {
  log("WARN", message);
}

function error(message) {
  log("ERROR", message);
}

module.exports = {
  debug,
  info,
  warn,
  error
};
