const express = require("express");
const { validateToken } = require("../middlewares/auth.middleware");
const { createTicket } = require("../controllers/tickets.controller");

const ticketRouter = express.Router();

ticketRouter.post("/tickets", validateToken, createTicket);

module.exports = { ticketRouter };