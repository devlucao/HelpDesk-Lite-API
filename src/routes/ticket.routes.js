const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const { createTicket, getTickets } = require("../controllers/tickets.controller");

const ticketRouter = express.Router();

ticketRouter.post("/tickets", validateToken, createTicket);
ticketRouter.get("/tickets", validateToken, getTickets)

module.exports = { ticketRouter };