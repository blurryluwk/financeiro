import CategoryService from "../services/categoryService.js";

const CategoryController = {
  list: async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      if (isNaN(userId)) throw { status: 400, message: "userId inválido" };

      const categories = await CategoryService.list(userId);
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  get: async (req, res) => {
    try {
      const category = await CategoryService.get(Number(req.params.id));
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  create: async (req, res) => {
    try {
      const category = await CategoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  update: async (req, res) => {
    try {
      const category = await CategoryService.update(Number(req.params.id), req.body);
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  delete: async (req, res) => {
    try {
      const result = await CategoryService.delete(Number(req.params.id));
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },
};

export default CategoryController;
