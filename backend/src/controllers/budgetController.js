const budgetService = require("../services/budgetService");

module.exports = {
  async getBudgets(req, res) {
    try {
      const userId = Number(req.query.userId);

      if (!userId) {
        return res.status(400).json({ error: "userId é obrigatório." });
      }

      const budgets = await budgetService.getBudgets(userId);
      res.json(budgets);
    } catch (err) {
      console.error("Erro no getBudgets:", err);
      res.status(500).json({ error: "Erro ao buscar budgets." });
    }
  },

  async saveBudget(req, res) {
    try {
      const { userId, category, limit } = req.body;

      if (!userId || !category || !limit) {
        return res.status(400).json({ error: "Dados incompletos." });
      }

      const result = await budgetService.saveBudget(
        Number(userId),
        category,
        Number(limit)
      );

      res.json(result);
    } catch (err) {
      console.error("Erro no saveBudget:", err);
      res.status(500).json({ error: "Erro ao salvar orçamento." });
    }
  },

  async deleteBudget(req, res) {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await budgetService.deleteBudget(id);

      res.json({ success: true });
    } catch (err) {
      console.error("Erro no deleteBudget:", err);
      res.status(500).json({ error: "Erro ao apagar orçamento." });
    }
  },
};
