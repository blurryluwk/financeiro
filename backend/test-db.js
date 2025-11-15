import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao banco com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
