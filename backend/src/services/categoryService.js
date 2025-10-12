const CategoryRepository = require("../repositories/categoryRepository");

const CategoryService = {
  list: (userId) => CategoryRepository.findByUserId(userId),

  get: (id) => {
    const category = CategoryRepository.findById(id);
    if (!category) throw { status: 404, message: "Categoria não encontrada" };
    return category;
  },

  create: ({ name, userId }) => {
    if (!name || !userId) throw { status: 400, message: "Nome e usuário são obrigatórios" };
    return CategoryRepository.create({ name, userId });
  },

  update: (id, data) => {
    const updated = CategoryRepository.update(id, data);
    if (!updated) throw { status: 404, message: "Categoria não encontrada" };
    return updated;
  },

  delete: (id) => {
    const deleted = CategoryRepository.delete(id);
    if (!deleted) throw { status: 404, message: "Categoria não encontrada" };
    return { message: "Categoria removida com sucesso" };
  },
};

module.exports = CategoryService;
