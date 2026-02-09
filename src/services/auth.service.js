const users = require("../database/users.db");
const jwt = require("jsonwebtoken");
const { AppError } = require("../errors/AppError");

const authService = (email, password) => {
  if(!email || !password) {
    throw new AppError(400, "Campo e-mail e senha são obrigatórios.");
  }

  const foundUser = users.find((user) => email === user.email);

  if(!foundUser) {
    throw new AppError(401, "Usuário não existe, favor verificar.");
  }

  if(foundUser.password !== password) {
    throw new AppError(401, "Senha incorreta. Tente novamente.");
  }

  const payload = {
    userId: foundUser.id,
    role: foundUser.role
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  return token;

}

module.exports = {
  authService
}