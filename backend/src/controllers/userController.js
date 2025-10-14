import UserService from "../services/userService.js";
import jwt from "jsonwebtoken";

const UserController = {
  register: async (req, res) => {
    try {
      const newUser = await UserService.register(req.body);

      // Criar categorias padrão
      if (newUser && newUser.id) {
        await UserService.createDefaultCategories(newUser.id);
      }

      // Criar token JWT
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      return res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.error(error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Erro interno" });
    }
  },

  login: async (req, res) => {
    try {
      const user = await UserService.login(req.body);

      // criar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "7d" }
      );

      // ⚠ retorna diretamente user + token
      return res.json({ user, token });
    } catch (error) {
      console.error(error);
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
