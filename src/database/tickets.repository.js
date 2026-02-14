const { prisma } = require("./prisma")

const createTicket = async (ticketModel) => {
  return prisma.ticket.create({
    data: ticketModel,
  });
}

module.exports = { createTicket };