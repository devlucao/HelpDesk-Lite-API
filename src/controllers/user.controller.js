const getMe = (req, res) => {
  const { userId, role } = req.user;
  return res.status(200).json({ userId, role });
}

const isAdmin = (req, res) => {
  return res.status(200).json({ message: `Sucesso! Usuário ${req.user.userId} tem permissões de administrador.` });
}

module.exports = { getMe, isAdmin }
