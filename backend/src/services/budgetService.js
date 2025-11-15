const budgetRepo = require("../repositories/budgetRepository");

module.exports = {
  async getBudgets(userId) {
    return budgetRepo.findByUser(userId);
  },

  async saveBudget(userId, category, limit) {
    // Verifica se já existe budget para a categoria
    const exists = await budgetRepo.findByUserAndCategory(userId, category);

    if (exists) {
      return budgetRepo.updateBudget(exists.id, limit);
    }

    return budgetRepo.createBudget(userId, category, limit);
  },

  async deleteBudget(id) {
    return budgetRepo.deleteBudget(id);
  },
};
