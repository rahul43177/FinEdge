function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

function throwError400(message) {
  throwError(message, 400);
}

function throwError401(message) {
  throwError(message, 401);
}

function throwError403(message) {
  throwError(message, 403);
}

function throwError404(message) {
  throwError(message, 404);
}

function throwError409(message) {
  throwError(message, 409);
}

function throwError422(message) {
  throwError(message, 422);
}

module.exports = {
  throwError,
  throwError400,
  throwError401,
  throwError403,
  throwError404,
  throwError409,
  throwError422
};