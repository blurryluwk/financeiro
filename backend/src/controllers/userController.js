import UserService from "../services/userService.js";
import jwt from "jsonwebtoken";

const UserController = {
  register: async (req, res) => {
    try {
      const newUser = await UserService.register(req.body);

      if (!newUser || !newUser.id) {
        return res.status(400).json({ error: "Falha ao criar usuário" });
      }

      // Cria categorias padrão
      await UserService.createDefaultCategories(newUser.id);

      // Cria token JWT
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      // Retorna apenas dados seguros
      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      return res.status(201).json({ user: safeUser, token });
    } catch (error) {
      console.error(error);
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
};

export default UserController;
