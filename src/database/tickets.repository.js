const { prisma } = require("./prisma")

const createTicket = async (ticketModel) => {
  return prisma.ticket.create({
    data: ticketModel,
  });
}

const findTickets = async ({ where, skip, take }) => {
  const total = await prisma.ticket.count({ where });
  const data = await prisma.ticket.findMany({
    where,
    skip,
    take,
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
  });

  return { total, data }
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