import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "umsegurosegredo123";

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

    // Gera token JWT
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

    return { user: { id: newUser.id, name: newUser.name, email: newUser.email }, token };
  },

  login: async ({ email, password }) => {
    if (!email || !password) throw { status: 400, message: "Preencha todos os campos" };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { status: 404, message: "Usuário não encontrado" };

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) throw { status: 401, message: "Senha incorreta" };

    // Gera token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return { user: { id: user.id, name: user.name, email: user.email }, token };
  },

  listUsers: async () => {
    return await prisma.user.findMany({ select: { id: true, name: true, email: true } });
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
