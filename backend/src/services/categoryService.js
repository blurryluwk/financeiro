import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CategoryService = {
  list: async (user_id) => {
    if (!user_id) throw { status: 400, message: "user_id obrigatório" };

    return await prisma.category.findMany({
      where: { user_id },
      include: { user: true },
    });
  },

  get: async (id) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw { status: 404, message: "Categoria não encontrada" };
    return category;
  },

  create: async ({ name, user_id }) => {
    if (!name || !user_id) throw { status: 400, message: "Nome e usuário são obrigatórios" };

    return await prisma.category.create({ data: { name, user_id } });
  },

  update: async (id, data) => {
    try {
      return await prisma.category.update({ where: { id }, data });
    } catch {
      throw { status: 404, message: "Categoria não encontrada" };
    }
  },

  delete: async (id) => {
    try {
      await prisma.category.delete({ where: { id } });
      return { message: "Categoria removida com sucesso" };
    } catch {
      throw { status: 404, message: "Categoria não encontrada" };
    }
  },
};

export default CategoryService;
