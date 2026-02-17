const { createTicketService, getTicketsService, getTicketsByIdService, updateTicketStatusService } = require("../services/tickets.service");

const createTicket = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { userId } = req.user;

    const newTicket = await createTicketService(userId, title, description);

    return res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
}

const getTickets = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const { page, limit, status } = req.query;

    const tickets = await getTicketsService(role, userId, page, limit, status);

    return res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
};

const getTicketsById = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;

    const ticket = await getTicketsByIdService(id, role, userId);

    return res.status(200).json(ticket)
  } catch (err) {

    next(err);
  }
}

const updateTicketStatus = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await updateTicketStatusService(id, role, status);

    return res.status(200).json(ticket);
  } catch(err) {
    next(err);
  }
}

module.exports = { createTicket, getTickets, getTicketsById, updateTicketStatus }