const users = require("../database/users.db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { AppError } = require("../errors/AppError");

const authService = async (email, password) => {
  if(!email || !password) {
    throw new AppError(400, "Campo e-mail e senha são obrigatórios.");
  }
  
  const foundUser = users.find((user) => email === user.email);
  const isValidPassword = await bcrypt.compare(password, foundUser.passwordHash);

  if(!foundUser) {
    throw new AppError(401, "Credenciais inválidas.");
  }

  if(!isValidPassword) {
    throw new AppError(401, "Credenciais inválidas.");
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