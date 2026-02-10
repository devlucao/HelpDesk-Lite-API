const users = require("../database/users.db");
const bcrypt = require("bcrypt");
const { AppError } = require("../errors/AppError");

const createUserService = async (name, email, password) => {
  const userExists = users.find((user) => user.email === email);

  if(!name || !email || !password) {
    throw new AppError(400, "Favor preencher todos os campos obrigatórios.");
  }
  if(userExists) {
    throw new AppError(409, "E-mail já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const clientsQuantity = users.filter((user) => user.role === "client").length;

  const createClientId = (clientsQuantity) => {
    const preffix = "u-2";
    const count = clientsQuantity + 1;
    const suffix = count < 100 ? count.toString().padStart(2, '0') : count.toString().padStart(3, '0');
    const newId = preffix + suffix;
    
    return newId;
  }

  const newUser = {
    id: createClientId(clientsQuantity),
    name,
    email,
    role: "client",
    passwordHash,
    createdAt: new Date().toISOString()
  }

  users.push(newUser);

  return { 
    id: newUser.id,
    name: newUser.name, 
    email: newUser.email, 
    role: newUser.role
  };
}

module.exports = { createUserService };
