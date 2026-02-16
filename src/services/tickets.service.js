const { createTicket, findTickets, findTicketById, updateTicket } = require("../database/tickets.repository");
const { findUserById } = require("../database/users.repository");
const { AppError } = require("../errors/AppError");

const createTicketService = async (userId, title, description) => {
  const userExists = await findUserById(userId);

  if (!title) {
    throw new AppError(400, "Favor informar um título para o ticket.");
  }

  if (!userExists) {
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
  if (!role) {
    throw new AppError(401, "Função inexistente.");
  }

  if (!userId) {
    throw new AppError(401, "Usuário não encontrado.");
  }

  const tickets = await findTickets(role, userId);

  return tickets;
}

const getTicketsByIdService = async (ticketId, role, userId) => {
  const ticket = await findTicketById(ticketId);

  if (!ticket) {
    throw new AppError(404, 'Ticket não encontrado');
  }

  if (role === "client" && userId !== ticket.createdById) {
    throw new AppError(403, "Você não tem permissão para acessar este ticket.")
  }

  return ticket;
}

const updateTicketStatusService = async (ticketId, role, status) => {
  const ALLOWED_STATUS = ["open", "closed", "in_progress"];

  if (!status || !ALLOWED_STATUS.includes(status)) {
    throw new AppError(400, "Favor informar o novo status do ticket (usar: open, closed ou in_progress).");
  }

  if (role === "client") {
    throw new AppError(403, "Você não tem permissão para alterar este ticket.");
  }

  try {
    return await updateTicket(ticketId, status);
  } catch (err) {
    throw new AppError(404, "Ticket não encontrado.");
  }
}

module.exports = { createTicketService, getTicketsService, getTicketsByIdService, updateTicketStatusService };