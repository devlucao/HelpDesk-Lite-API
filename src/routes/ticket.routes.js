const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const {
  createTicket,
  getTickets,
  getTicketsById,
  updateTicketStatus,
  assignTicketToId
} = require("../controllers/tickets.controller");

const ticketRouter = express.Router();

ticketRouter.post("/tickets", validateToken, createTicket);

ticketRouter.get("/tickets", validateToken, getTickets)
ticketRouter.get("/tickets/:id", validateToken, getTicketsById);

ticketRouter.patch("/tickets/:id/status", validateToken, updateTicketStatus)
ticketRouter.patch("/tickets/:id/assign", validateToken, assignTicketToId)

module.exports = { ticketRouter };