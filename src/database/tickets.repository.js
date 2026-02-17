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

const updateTicket = async (db, id, status) => {
  return db.ticket.update({
    where: { id },
    data: { status }
  })
}

const assignTicket = async (db, id, assignedToId) => {
  return db.ticket.update({
    where: { id },
    data: { assignedToId }
  })
}

module.exports = { createTicket, findTickets, findTicketById, updateTicket, assignTicket };