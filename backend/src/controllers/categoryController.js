const CategoryService = require("../services/categoryService");

const CategoryController = {
  list: (req, res) => {
    try {
      const userId = Number(req.query.userId);
      const categories = CategoryService.list(userId);
      res.json(categories);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  get: (req, res) => {
    try {
      const category = CategoryService.get(Number(req.params.id));
      res.json(category);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  create: (req, res) => {
    try {
      const { name, userId } = req.body;
      const category = CategoryService.create({ name, userId });
      res.status(201).json(category);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  update: (req, res) => {
    try {
      const category = CategoryService.update(Number(req.params.id), req.body);
      res.json(category);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  delete: (req, res) => {
    try {
      const result = CategoryService.delete(Number(req.params.id));
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },
};

module.exports = CategoryController;
