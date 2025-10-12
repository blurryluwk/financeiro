// src/controllers/transactionController.js
const TransactionService = require("../services/transactionService");

const TransactionController = {
  list: (req, res) => {
    try {
      const transactions = TransactionService.list();
      res.json(transactions);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  get: (req, res) => {
    try {
      const transaction = TransactionService.get(Number(req.params.id));
      res.json(transaction);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  create: (req, res) => {
    try {
      const transaction = TransactionService.create(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  update: (req, res) => {
    try {
      const transaction = TransactionService.update(Number(req.params.id), req.body);
      res.json(transaction);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },

  delete: (req, res) => {
    try {
      const result = TransactionService.delete(Number(req.params.id));
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ error: error.message || "Erro interno" });
    }
  },
};

module.exports = TransactionController;
