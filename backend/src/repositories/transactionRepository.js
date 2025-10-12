// src/repositories/transactionRepository.js
let transactions = []; // banco temporário

const TransactionRepository = {
  findAll: () => transactions,

  findById: (id) => transactions.find(t => t.id === id),

  create: ({ description, amount, type, category }) => {
    const id = transactions.length + 1;
    const newTransaction = { id, description, amount, type, category };
    transactions.push(newTransaction);
    return newTransaction;
  },

  update: (id, data) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return null;

    Object.assign(transaction, data);
    return transaction;
  },

  delete: (id) => {
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    transactions.splice(index, 1);
    return true;
  },
};

module.exports = TransactionRepository;
