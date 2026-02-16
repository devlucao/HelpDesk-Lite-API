const { prisma } = require("./prisma")

const createTicket = async (ticketModel) => {
  return prisma.ticket.create({
    data: ticketModel,
  });
}

const findTickets = async (role, userId) => {
  const where = role === "client" ? { createdById: userId } : {}; // admin/agentet sem filtro

  return prisma.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy:
      {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    },
  })
}

const findTicketById = async (id) => {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
}

const updateTicket = async (id, status) => {
  return prisma.ticket.update({
    where: { id },
    data: { status }
  })
}

module.exports = { createTicket, findTickets, findTicketById, updateTicket };