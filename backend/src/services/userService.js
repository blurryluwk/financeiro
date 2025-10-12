const UserRepository = require("../repositories/userRepository");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUserWithDefaultCategories(name, email) {
  const user = await prisma.user.create({ data: { name, email } });

  const defaultCategories = [
    { name: "Alimentação", userId: user.id },
    { name: "Transporte", userId: user.id },
    { name: "Lazer", userId: user.id },
    { name: "Saúde", userId: user.id },
    { name: "Educação", userId: user.id },
    { name: "Outros", userId: user.id },
    { name: "Salário", userId: user.id },
    { name: "Freelance", userId: user.id },
    { name: "Investimentos", userId: user.id },
  ];

  await prisma.category.createMany({ data: defaultCategories });
  return user;
}

const UserService = {
  register: ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw { status: 400, message: "Preencha todos os campos" };
    }

    const existingUser = UserRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 409, message: "E-mail já cadastrado" };
    }

    //add criptografia de senha, validação de email
    const newUser = UserRepository.create({ name, email, password });
    return newUser;
  },

  login: ({ email, password }) => {
    const user = UserRepository.findByEmail(email);
    if (!user) throw { status: 404, message: "Usuário não encontrado" };
    if (user.password !== password) throw { status: 401, message: "Senha incorreta" };

    // gerar um JWT em vez de retornar a senha
    return { id: user.id, name: user.name, email: user.email };
  },

  listUsers: () => {
    return UserRepository.findAll();
  },
};

module.exports = UserService;
