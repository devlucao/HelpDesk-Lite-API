require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Pool = gerenciador de conexões (reutiliza conexões, não abre 1 por query)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Adapter = Prisma usando o driver pg
const adapter = new PrismaPg(pool);

// PrismaClient agora nasce "válido" para conexão direta
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };
