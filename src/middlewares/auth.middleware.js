const jwt = require("jsonwebtoken");
const { AppError } = require("../errors/AppError");

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next (new AppError(401, "Autorização inválida."))
  }

  const [method, token] = authHeader.split(" ");

  if (!method || method !== "Bearer") {
    return next (new AppError(401, "Erro na autenticação, método inválido."));
  }

  if (!token) {
    return next (new AppError(401, "Usuário não autenticado. Token ausente."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: decoded.userId, role: decoded.role };

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next (new AppError(401, "Token expirado."));
    }
    return next (new Error(401, error.message));
  }

  next()
}

module.exports = { validateToken }