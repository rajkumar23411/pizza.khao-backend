const CustomErrorHandler = require("../middlewares/CustomErrorHandler");
const { ValidationError } = require("joi");
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "Internal Server Error",
    ...(process.env.DEBUG_MODE === "true" && { originalMessage: err.message }),
  };

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      message: err.message,
    };
  }
  return res.status(statusCode).json(data);
};

module.exports = errorHandler;
