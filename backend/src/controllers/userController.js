const UserService = require("../services/userService");

const UserController = {
  register: (req, res) => {
    try {
      const newUser = UserService.register(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  login: (req, res) => {
    try {
      const user = UserService.login(req.body);
      return res.json(user);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  listUsers: (req, res) => {
    try {
      const users = UserService.listUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar usuários" });
    }
  },
};

module.exports = UserController;
