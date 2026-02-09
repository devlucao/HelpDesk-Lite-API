const getMe = (req, res, next) => {
  const { userId, role } = req.user;

  try {
    return res.status(200).json({ userId, role });
  } catch(err) {
    next(err);
  }
}

const isAdmin = (req, res, next) => {
  try {
    return res.status(200).json({ message: `Sucesso! Usuário ${req.user.userId} tem permissões de administrador.` });
  } catch(err) {
    next(err);
  }
}

module.exports = { getMe, isAdmin }