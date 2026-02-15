const { createTicket, findTickets } = require("../database/tickets.repository");
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
    description: description || null,
    status: "open",
    createdById: userId,
  }

  const createdTicket = await createTicket(newTicket);

  return createdTicket;

}

const getTicketsService = async (role, userId) => {
  if(!role) {
    throw new AppError(401, "Função inexistente.");
  }

  if(!userId) {
    throw new AppError(401, "Usuário não encontrado.");
  }

  const tickets = await findTickets(role, userId);

  return tickets;
}

module.exports = { createTicketService, getTicketsService };