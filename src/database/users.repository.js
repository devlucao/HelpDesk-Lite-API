const { prisma } = require("./prisma");

// busca usuário por e-mail, sendo e-mail unique no schema
const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
}

// busca usuário por id, sendo id unique no schema
const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
}

// conta usuários por role
const countByRole = async (role) => {
  return prisma.user.count({
    where: { role },
  });
}

// cria usuário
const create = async (userModel) => {
  return prisma.user.create({
    data: userModel,
  });
}

module.exports = { findUserByEmail, findUserById, countByRole, create };
