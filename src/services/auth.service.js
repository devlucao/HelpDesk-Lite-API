const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { AppError } = require("../errors/AppError");
const { findUserByEmail } = require("../database/users.repository");

const authService = async (email, password) => {
  if(!email || !password) {
    throw new AppError(400, "Campo e-mail e senha são obrigatórios.");
  }
  
  const foundUser = await findUserByEmail(email);
  
  if(!foundUser) {
    throw new AppError(401, "Credenciais inválidas.");
  }
  
  const isValidPassword = await bcrypt.compare(password, foundUser.passwordHash);

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
