const users = [
  // ADMINS
  {
    id: "u-001",
    name: "Lucas Admin",
    email: "admin@helpdesk.com",
    password: "Admin@123",
    role: "admin",
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "u-002",
    name: "Mariana Admin",
    email: "mariana.admin@helpdesk.com",
    password: "Admin@123",
    role: "admin",
    createdAt: "2026-02-04T10:01:00.000Z",
  },

  // AGENTS (suporte)
  {
    id: "u-101",
    name: "Bruno Suporte",
    email: "bruno.agent@helpdesk.com",
    password: "Agent@123",
    role: "agent",
    createdAt: "2026-02-04T10:02:00.000Z",
  },
  {
    id: "u-102",
    name: "Camila Suporte",
    email: "camila.agent@helpdesk.com",
    password: "Agent@123",
    role: "agent",
    createdAt: "2026-02-04T10:03:00.000Z",
  },
  {
    id: "u-103",
    name: "Rafa Suporte",
    email: "rafa.agent@helpdesk.com",
    password: "Agent@123",
    role: "agent",
    createdAt: "2026-02-04T10:04:00.000Z",
  },

  // CLIENTS (clientes finais)
  {
    id: "u-201",
    name: "Ana Cliente",
    email: "ana.client@helpdesk.com",
    password: "Client@123",
    role: "client",
    createdAt: "2026-02-04T10:05:00.000Z",
  },
  {
    id: "u-202",
    name: "João Cliente",
    email: "joao.client@helpdesk.com",
    password: "Client@123",
    role: "client",
    createdAt: "2026-02-04T10:06:00.000Z",
  },
  {
    id: "u-203",
    name: "Bia Cliente",
    email: "bia.client@helpdesk.com",
    password: "Client@123",
    role: "client",
    createdAt: "2026-02-04T10:07:00.000Z",
  },
  {
    id: "u-204",
    name: "Diego Cliente",
    email: "diego.client@helpdesk.com",
    password: "Client@123",
    role: "client",
    createdAt: "2026-02-04T10:08:00.000Z",
  },
  {
    id: "u-205",
    name: "Lívia Cliente",
    email: "livia.client@helpdesk.com",
    password: "Client@123",
    role: "client",
    createdAt: "2026-02-04T10:09:00.000Z",
  },
  {
    id: "u-206",
    name: "Pedro Cliente",
    email: "pedro.client@helpdesk.com",
    password: "Client@123",
    role: "client",
    createdAt: "2026-02-04T10:10:00.000Z",
  },
];

module.exports = { users };
