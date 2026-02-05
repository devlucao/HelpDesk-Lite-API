const getMe = (req, res) => {
  const { userId, role } = req.user;

  try {
    return res.status(200).json({ userId, role });
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
}

const isAdmin = (req, res) => {
  try {
    return res.status(200).json({ message: `Sucesso! Usuário ${req.user.userId} tem permissões de administrador.` });
  } catch(error) {
    return res.status(500).json(error.message);
  }
}

module.exports = { getMe, isAdmin }