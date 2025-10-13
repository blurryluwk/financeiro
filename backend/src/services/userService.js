import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UserService = {
  register: async ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw { status: 400, message: "Preencha todos os campos" };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw { status: 409, message: "E-mail já cadastrado" };
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password_hash },
    });

    return newUser;
  },

  login: async ({ email, password }) => {
    if (!email || !password) throw { status: 400, message: "Preencha todos os campos" };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { status: 404, message: "Usuário não encontrado" };

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) throw { status: 401, message: "Senha incorreta" };

    return { id: user.id, name: user.name, email: user.email };
  },

  listUsers: async () => {
    return await prisma.user.findMany();
  },

  createDefaultCategories: async (userId) => {
    const defaultCategories = [
      "Alimentação", "Transporte", "Lazer", "Saúde",
      "Educação", "Outros", "Salário", "Freelance", "Investimentos"
    ].map(name => ({ name, user_id: userId }));

    return await prisma.category.createMany({ data: defaultCategories });
  },
};

export default UserService;
