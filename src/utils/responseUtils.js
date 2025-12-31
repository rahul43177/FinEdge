function successResponse(res, 
  statusCode = 200, 
  message = "Success", data = null) {
  const response = {
    status: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

module.exports = { successResponse };
