const { createTicket } = require("../database/tickets.repository");
const { findUserById } = require("../database/users.repository");
const { AppError } = require("../errors/AppError");

const createTicketService = async (userId, title, description) => {
  const userExists = await findUserById(userId);

  if (!title) {
    throw new AppError(400, "Favor informar um título para o ticket.");
  }

  if(!userExists) {
    throw new AppError(401, "Usuário não encontrado, tente novamente.");
  }

  const newTicket = {
    title,
    description: description,
    status: "open",
    createdAt: new Date().toISOString(),
    createdById: userId,
  }

  await createTicket(newTicket);

  return newTicket;

}

module.exports = { createTicketService };