// UserService.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
// 1. IMPORTAÇÃO NECESSÁRIA
import NotificationService from "./notificationService.js"; 

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "zzz";

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

    // 2. CHAMADA DA FUNÇÃO DE CRIAÇÃO DA NOTIFICAÇÃO
    try {
      await NotificationService.createNotification({
        userId: newUser.id,
        type: "WELCOME",
        title: "🎉 Bem-vindo(a) à Luton Money! 🎉",
        body: "Sua conta foi ativada com sucesso. A partir de agora, o poder é seu! Comece a explorar e descobrir todas as ferramentas incríveis que preparamos! ",
        linkUrl: "/",
      });
      // A falha na notificação não deve impedir o registro, apenas registramos o erro.
    } catch (error) {
      console.error("⚠️ Falha ao criar notificação de boas-vindas:", error);
    }
    // ----------------------------------------------------

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token,
    };
  },

  login: async ({ email, password }) => {
    console.log("📩 Dados recebidos no login:", { email, password });

    if (!email || !password) {
      console.log("⚠️ Campos ausentes no login");
      throw { status: 400, message: "Preencha todos os campos" };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("❌ Usuário não encontrado no banco");
      throw { status: 404, message: "Usuário não encontrado" };
    }

    console.log("🗝️ Hash salvo no banco:", user.password_hash);

    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log("🔍 Comparação de senha:", validPassword);

    if (!validPassword) {
      console.log("🚫 Senha incorreta");
      throw { status: 401, message: "Senha incorreta" };
    }

    try {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
      console.log("✅ Token gerado:", token.slice(0, 20) + "...");

      const result = {
        user: { id: user.id, name: user.name, email: user.email },
        token,
      };
      console.log("🧠 Retorno do login (antes do return):", result);
      return result;
    } catch (err) {
      console.error("🔥 Erro ao gerar token:", err);
      throw { status: 500, message: "Falha ao gerar token JWT" };
    }
  },

  listUsers: async () => {
    return await prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });
  },

  updateUser: async (userId, data) => {
    if (!data.name) {
      throw { status: 400, message: "O nome é obrigatório para atualização" };
    }

    // Converter o userId de String para Int
    const idAsInt = parseInt(userId);

    // Validação extra para garantir que a conversão foi bem-sucedida
    if (isNaN(idAsInt)) {
      throw { status: 400, message: "ID de usuário inválido." };
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: idAsInt }, // Use o ID convertido para Int
        data: { name: data.name },
        select: { id: true, name: true, email: true },
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw { status: 404, message: "Usuário não encontrado." };
      }
      console.error("Erro no UserService.updateUser:", error);
      throw { status: 500, message: "Erro ao atualizar o usuário no banco de dados." };
    }
  },
};

export default UserService;