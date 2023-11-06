const logger = require("./logger");
const morgan = require("morgan");

const morganLogger = morgan("tiny");
const requestLogger = (request, response, next) => {
  // Use Morgan to log the incoming request
  morganLogger(request, response, () => {
    next();
  });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { errorHandler, requestLogger };