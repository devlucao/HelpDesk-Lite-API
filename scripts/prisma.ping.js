const { prisma } = require("../src/database/prisma");

async function main() {
  const users = await prisma.user.findMany();
  console.log("✅ Connected to PostgreSQL via Prisma. Users:", users.length);
}

main()
  .catch((err) => {
    console.error("❌ Prisma ping failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
