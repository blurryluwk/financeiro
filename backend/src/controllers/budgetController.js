import BudgetService from "../services/budgetService.js";

class BudgetController {
  async list(req, res) {
    try {
      const userId = Number(req.query.userId);

      if (!userId) {
        return res.status(400).json({ error: "userId é obrigatório." });
      }

      const budgets = await BudgetService.list(userId);
      res.json(budgets);
    } catch (err) {
      console.error("Erro em BudgetController.list:", err);
      res.status(500).json({ error: "Erro ao buscar budgets." });
    }
  }

  async createOrUpdate(req, res) {
    try {
      const { userId, category, amount } = req.body;

      if (!userId || !category || !amount) {
        return res.status(400).json({ error: "Dados incompletos." });
      }

      const result = await BudgetService.save(
        Number(userId),
        category,
        Number(amount)
      );

      res.json(result);
    } catch (err) {
      console.error("Erro em BudgetController.createOrUpdate:", err);
      res.status(500).json({ error: "Erro ao salvar orçamento." });
    }
  }

  async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({ error: "ID inválido." });
      }

      await BudgetService.delete(id);

      res.json({ success: true });
    } catch (err) {
      console.error("Erro em BudgetController.delete:", err);
      res.status(500).json({ error: "Erro ao apagar orçamento." });
    }
  }
}

export default new BudgetController();
