const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Autorização inválida." });
  }

  const [method, token] = authHeader.split(" ");

  if (!method || method !== "Bearer") {
    return res.status(401).json({ error: "Erro na autenticação, método inválido." });
  }

  if (!token) {
    return res.status(401).json({ error: "Usuário não autenticado. Token ausente." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: decoded.userId, role: decoded.role };

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado." });
    }
    return res.status(401).json({ error: error.message });
  }

  next()
}

module.exports = { validateToken }