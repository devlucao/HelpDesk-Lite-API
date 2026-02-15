const bcrypt = require("bcrypt");
const { AppError } = require("../errors/AppError");
const { findUserByEmail, create, countByRole, findUserById } = require("../database/users.repository");

const toPublicUser = (user) => {
  const { id, name, email, role, createdAt} = user;

  return { id, name, email, role, createdAt };
}

const createClientId = (clientsQuantity) => {
  const preffix = "u-2";
  const count = clientsQuantity + 1;
  const suffix = count < 100 ? count.toString().padStart(2, '0') : count.toString().padStart(3, '0');
  const newId = preffix + suffix;

  return newId;
}

const getMeService = async (userId) => {
  const foundUser = await findUserById(userId);

  if (!foundUser) {
    throw new AppError(401, "Usuário inválido.");
  }

  return toPublicUser(foundUser);
}

const createUserService = async (name, email, password) => {
  const userExists = await findUserByEmail(email);

  if (!name || !email || !password) {
    throw new AppError(400, "Favor preencher todos os campos obrigatórios.");
  }
  if (userExists) {
    throw new AppError(409, "E-mail já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const clientsQuantity = await countByRole("client");

  const newUser = {
    id: createClientId(clientsQuantity),
    name,
    email,
    role: "client",
    passwordHash,
  }

  await create(newUser);

  return toPublicUser(newUser)
}

module.exports = { getMeService, createUserService };
