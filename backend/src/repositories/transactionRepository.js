// transactionRepository.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Buscar todas as transações de um usuário
 * @param {number} userId 
 * @returns {Promise<Array>}
 */
export async function findAll(userId) {
  if (!userId) throw new Error("userId é obrigatório");

  return await prisma.transaction.findMany({
    where: { user_id: userId },
    include: { category: true }, // traz dados da categoria
  });
}

/**
 * Buscar transação por ID
 * @param {number} id 
 * @returns {Promise<Object|null>}
 */
export async function findById(id) {
  if (!id) throw new Error("id é obrigatório");

  return await prisma.transaction.findUnique({
    where: { id },
    include: { category: true },
  });
}

/**
 * Criar nova transação
 * @param {Object} data 
 * @param {string} data.description
 * @param {number} data.amount
 * @param {"income"|"expense"} data.type
 * @param {number} data.categoryId
 * @param {number} data.userId
 * @param {string} data.date
 * @returns {Promise<Object>}
 */

export async function create(transactionData) {
   console.log("DADOS RECEBIDOS PELO REPOSITÓRIO:", transactionData);
  return await prisma.transaction.create({
    data: transactionData,
    include: { category: true },
  });
}

/**
 * Atualizar transação
 * @param {number} id 
 * @param {Object} data 
 * @returns {Promise<Object|null>}
 */
export async function update(id, data) {
  try {
    // mapear categoryId se fornecido
    const updatedData = { ...data };
    if (data.categoryId) {
      updatedData.category_id = data.categoryId;
      delete updatedData.categoryId;
    }
    if (data.userId) {
      updatedData.user_id = data.userId;
      delete updatedData.userId;
    }

    return await prisma.transaction.update({
      where: { id },
      data: updatedData,
      include: { category: true },
    });
  } catch (err) {
    return null;
  }
}

/**
 * Deletar transação
 * @param {number} id 
 * @returns {Promise<boolean>}
 */
export async function deleteById(id) {
  try {
    await prisma.transaction.delete({ where: { id } });
    return true;
  } catch (err) {
    return false;
  }
}
