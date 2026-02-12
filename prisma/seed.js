const bcrypt = require("bcrypt");
const { prisma } = require("../src/database/prisma");

const main = async () => {
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const agentHash = await bcrypt.hash("Agent@123", 10);
  const clientHash = await bcrypt.hash("Client123", 10);

  const usersToCreate = [
    {
      id: "u-001",
      name: "Lucas Admin",
      email: "admin@helpdesk.com",
      passwordHash: adminHash,
      role: "admin",
    },
    {
      id: "u-101",
      name: "Bruno Suporte",
      email: "bruno.agent@helpdesk.com",
      passwordHash: agentHash,
      role: "agent",
    },
    {
      id: "u-201",
      name: "Ana Cliente",
      email: "ana.client@helpdesk.com",
      passwordHash: clientHash,
      role: "client",
    },
  ]

  for(const user of usersToCreate) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        passwordHash: user.passwordHash,
        role: user.role,
      },
      create: user,
    });
  }

  console.log("✅ Seed completed. Users:", usersToCreate.length);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  