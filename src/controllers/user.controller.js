const { getMeService } = require("../services/users.service");

const getMe = async (req, res) => {
  const { userId } = req.user;

  const user = await getMeService(userId);

  return res.status(200).json(user);
}

const isAdmin = (req, res) => {
  return res.status(200).json({ message: `Sucesso! Usuário ${req.user.userId} tem permissões de administrador.` });
}

module.exports = { getMe, isAdmin }
