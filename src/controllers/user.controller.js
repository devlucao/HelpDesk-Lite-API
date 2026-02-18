const { getMeService } = require("../services/users.service");
const { ok } = require("../utils/httpResponse");

const getMe = async (req, res) => {
  const { userId } = req.user;

  const user = await getMeService(userId);

  return ok(res, user);
}

const isAdmin = (req, res) => {
  return ok(res, { message: `Sucesso! Usuário ${req.user.userId} tem permissões de administrador.` });
}

module.exports = { getMe, isAdmin }
