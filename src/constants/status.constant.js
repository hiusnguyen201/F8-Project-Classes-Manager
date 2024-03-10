const STATUS_MESSAGE = {
  SERVER_ERROR: "Server Error",
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized to request",
  SUCCESS: "Success",
};

const STATUS_CODE = {
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  SUCCESS: 200,
};

module.exports = { STATUS_MESSAGE, STATUS_CODE };
