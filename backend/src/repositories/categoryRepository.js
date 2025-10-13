import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function findAll(userId) {
  if (!userId) throw new Error("userId é obrigatório");
  return await prisma.transaction.findMany({
    where: { user_id: userId },
    include: { category: true },
  });
}

export async function findById(id) {
  if (!id) throw new Error("id é obrigatório");
  return await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function create({ description, amount, type, categoryId, userId, date }) {
  if (!description || !amount || !type || !categoryId || !userId || !date) {
    throw new Error("Preencha todos os campos");
  }

  return await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      category_id: categoryId,
      user_id: userId,
      date,
    },
    include: { category: true },
  });
}

export async function update(id, data) {
  try {
    return await prisma.transaction.update({
      where: { id },
      data,
      include: { category: true },
    });
  } catch (err) {
    return null;
  }
}

export async function deleteById(id) {
  try {
    await prisma.transaction.delete({ where: { id } });
    return true;
  } catch (err) {
    return false;
  }
}
