const validateRole = (req, res, next) => {
  const { role } = req.user;

  if(role !== "admin") {
    return res.status(403).json({ error: "Usuário não autorizado." });
  }

  next();
}

module.exports = { validateRole }