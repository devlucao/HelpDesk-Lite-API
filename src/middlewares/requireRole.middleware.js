const { AppError } = require("../errors/AppError");

const validateRole = (req, res, next) => {
  const { role } = req.user;

  if(role !== "admin") {
    return next (new AppError(403, "Usuário não autorizado."));
  }

  next();
}

module.exports = { validateRole }