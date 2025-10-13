import UserService from "../services/userService.js";

const UserController = {
  register: async (req, res) => {
    try {
      const newUser = await UserService.register(req.body);

      // Criar categorias padrão
      if (newUser && newUser.id) {
        await UserService.createDefaultCategories(newUser.id);
      }

      return res.status(201).json(newUser);
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
      return res.json(user);
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
