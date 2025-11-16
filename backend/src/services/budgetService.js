import BudgetRepository from "../repositories/budgetRepository.js";

class BudgetService {
  async list(userId) {
    return BudgetRepository.findAllByUser(userId);
  }

  async save(userId, category, amount) {
    const existing = await BudgetRepository.findByUserAndCategory(
      userId,
      category
    );

    if (existing) {
      return BudgetRepository.update(existing.id, amount);
    }

    return BudgetRepository.create(userId, category, amount);
  }

  async delete(id) {
    return BudgetRepository.delete(id);
  }
}

export default new BudgetService();
