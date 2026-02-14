const { createTicketService } = require("../services/tickets.service");

const createTicket = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { userId } = req.user;
  
    const newTicket = await createTicketService(userId, title, description);

    return res.status(201).json(newTicket);
  } catch(err) {
    next(err);
  }
}

module.exports = { createTicket }