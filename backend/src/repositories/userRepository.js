import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function create({ name, email, password_hash }) {
  return await prisma.user.create({
    data: {
      name,
      email,
      password_hash, 
    },
  });
}

export async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findAll() {
  return await prisma.user.findMany();
}

