import BudgetRepository from "../repositories/budgetRepository.js";

class BudgetService {
  async list(userId) {
    return BudgetRepository.findAllByUser(userId);
  }

  async save(userId, category, limit) {
    const existing = await BudgetRepository.findByUserAndCategory(
      userId,
      category
    );

    if (existing) {
      return BudgetRepository.update(existing.id, limit);
    }

    return BudgetRepository.create(userId, category, limit);
  }

  async delete(id) {
    return BudgetRepository.delete(id);
  }
}

export default new BudgetService();
