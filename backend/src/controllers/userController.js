import UserService from "../services/userService.js";
import jwt from "jsonwebtoken";

const UserController = {
  register: async (req, res) => {
    try {
      console.log("📩 BODY recebido para registro:", req.body);

      const newUser = await UserService.register(req.body);
      console.log("✅ Retorno do UserService.register:", newUser);

      if (!newUser || !newUser.id) {
        console.log("⚠️ Falha ao criar usuário:", newUser);
        return res.status(400).json({ error: "Falha ao criar usuário" });
      }

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || "zzz",
        { expiresIn: "7d" }
      );
      console.log("Token JWT gerado:", token);

      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };
      console.log("👤 Usuário seguro retornado:", safeUser);

      return res.status(201).json({ user: safeUser, token });
    } catch (error) {
      console.error("🔥 Erro no registro:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Erro interno" });
    }
  },

  login: async (req, res) => {
    try {
      console.log("📩 BODY recebido:", req.body);
      const { user, token } = await UserService.login(req.body);
      console.log("✅ Retorno do UserService:", user, token);

      if (!user || !user.id) {
        console.log("⚠️ Usuário inválido no retorno:", user);
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      return res.json({ user, token });
    } catch (error) {
      console.error("🔥 Erro no login:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Erro interno" });
    }
  },

  listUsers: async (req, res) => {
    try {
      const users = await UserService.listUsers();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar usuários" });
    }
  },

updateUser: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    console.log("📩 Requisição para atualizar usuário:", id, "com:", req.body);

    // Validação simples
    if (!name || typeof name !== "string") {
      console.log("⚠️ Falha na validação do 'name'. Campos inválidos:", req.body);
      return res.status(400).json({ error: "Campo 'name' é obrigatório e deve ser uma string" });
    }

    try {
      console.log("✅ Validação concluída. Atualizando usuário...");

      const updatedUser = await UserService.updateUser(id, { name });

      if (!updatedUser) {
        console.log("⚠️ Usuário não encontrado para atualização. ID:", id);
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Retorna apenas dados seguros
      const safeUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      };

      console.log("✅ Usuário atualizado com sucesso:", safeUser);
      return res.json(safeUser);
    } catch (error) {
      console.error("🔥 Erro ao atualizar usuário:", error);
      return res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }
};

export default UserController;
