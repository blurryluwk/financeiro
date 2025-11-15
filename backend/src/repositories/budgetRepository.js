import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

module.exports = {
  async findByUser(userId) {
    return prisma.budget.findMany({
      where: { userId },
      orderBy: { category: "asc" },
    });
  },

  async findByUserAndCategory(userId, category) {
    return prisma.budget.findFirst({
      where: { userId, category },
    });
  },

  async createBudget(userId, category, limit) {
    return prisma.budget.create({
      data: { userId, category, limit: Number(limit) },
    });
  },

  async updateBudget(id, limit) {
    return prisma.budget.update({
      where: { id },
      data: { limit: Number(limit) },
    });
  },

  async deleteBudget(id) {
    return prisma.budget.delete({
      where: { id },
    });
  },
};