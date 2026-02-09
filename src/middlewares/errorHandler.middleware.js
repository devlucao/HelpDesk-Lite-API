const { AppError } = require("../errors/AppError");

const errorHandler = (err, _req, res, _next) => {
  const status = Number.isInteger(err.statusCode) ? err.statusCode : 500;

  if (err instanceof AppError) {
    return res.status(status).json({ error: err.message });
  }

  console.error(err);

  return res.status(status).json({ error: "Internal server error." });
}

module.exports = { errorHandler };