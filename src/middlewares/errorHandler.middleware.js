const { AppError } = require("../errors/AppError");

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  if(err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);

  return res.status(status).json({
    error: err.message || "Internal server error."
  });
}

module.exports = { errorHandler };