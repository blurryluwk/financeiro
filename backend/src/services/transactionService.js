// src/services/transactionService.js
const TransactionRepository = require("../repositories/transactionRepository");

const TransactionService = {
  list: () => TransactionRepository.findAll(),

  get: (id) => {
    const transaction = TransactionRepository.findById(id);
    if (!transaction) throw { status: 404, message: "Transação não encontrada" };
    return transaction;
  },

  create: ({ description, amount, type, category }) => {
    if (!description || !amount || !type || !category) {
      throw { status: 400, message: "Preencha todos os campos" };
    }
    return TransactionRepository.create({ description, amount, type, category });
  },

  update: (id, data) => {
    const updated = TransactionRepository.update(id, data);
    if (!updated) throw { status: 404, message: "Transação não encontrada" };
    return updated;
  },

  delete: (id) => {
    const deleted = TransactionRepository.delete(id);
    if (!deleted) throw { status: 404, message: "Transação não encontrada" };
    return { message: "Transação removida com sucesso" };
  },
};

module.exports = TransactionService;
