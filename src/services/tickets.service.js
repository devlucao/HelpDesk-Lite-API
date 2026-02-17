const { createTicket, findTickets, findTicketById, updateTicket } = require("../database/tickets.repository");
const { findUserById } = require("../database/users.repository");
const { AppError } = require("../errors/AppError");

const ALLOWED_STATUS = ["open", "closed", "in_progress"];

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

const getTicketsService = async (role, userId, page, limit, status) => {
  const pageNumber = Number(page ?? 1); // se não vier, assume 1
  const limitNumber = Number(limit ?? 10); // se não vier, assume 10

  if (!role) {
    throw new AppError(401, "Função inexistente.");
  }

  if (!userId) {
    throw new AppError(401, "Usuário não encontrado.");
  }

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    throw new AppError(400, "Parâmetro page inválido. Use um inteiro >= 1.");
  }

  if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 50) {
    throw new AppError(400, "Parâmetro limit inválido. Use um inteiro entre 1 e 50.");
  }

  if (status && !ALLOWED_STATUS.includes(status)) {
    throw new AppError(400, "Status inválido. Use: open, in_progress, closed.");
  }

  const where = {};

  if(role === "client") {
    where.createdById = userId;
  }

  if(status) {
    where.status = status;
  }

  const skip = (pageNumber - 1) * limitNumber;
  const take = limitNumber;

  const { total, data } = await findTickets({ where, skip, take });

  const totalPages = Math.ceil(total / limitNumber);

  return {
    meta: { page: pageNumber, limit: limitNumber, total, totalPages },
    data
  };
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