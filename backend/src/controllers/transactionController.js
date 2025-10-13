import TransactionService from "../services/transactionService.js";

const TransactionController = {
  list: async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      const transactions = await TransactionService.list(userId);
      res.json(transactions);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  get: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const transaction = await TransactionService.get(id);
      res.json(transaction);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  create: async (req, res) => {
    try {
      const transaction = await TransactionService.create(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const transaction = await TransactionService.update(id, req.body);
      res.json(transaction);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await TransactionService.delete(id);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },
};

export default TransactionController;
