import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class BudgetRepository {
  // Lista todos os budgets de um usuário, incluindo os dados da categoria
  async findAllByUser(user_id) {
    return prisma.budget.findMany({
      where: { user_id },
      include: { category: true }, // inclui dados da categoria
      orderBy: { category_id: "asc" },
    });
  }

  // Busca budget de um usuário para uma categoria específica
  async findByUserAndCategory(user_id, category_id) {
    return prisma.budget.findFirst({
      where: { user_id, category_id },
    });
  }

  // Cria um novo budget
  async create(user_id, category_id, amount) {
    return prisma.budget.create({
      data: {
        user_id,
        category_id,
        amount: Number(amount),
      },
    });
  }

  // Atualiza o limite de um budget existente
  async update(id, amount) {
    return prisma.budget.update({
      where: { id },
      data: { amount: Number(amount) },
    });
  }

  // Deleta um budget
  async delete(id) {
    return prisma.budget.delete({
      where: { id },
    });
  }
}

export default new BudgetRepository();
