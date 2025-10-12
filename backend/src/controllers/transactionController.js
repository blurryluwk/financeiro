const transactionService = require('../services/transactionService');

const getAll = async (req, res) => {
    try {
        const transactions = await transactionService.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        // Lógica de tratamento de erro
        res.status(500).json({ error: error.message });
    }
};
const create = async (req, res) => {
    try {
        const newTransaction = await transactionService.create(req.body);
        res.status(201).json(newTransaction);
    } catch (error) {
        // Lógica de tratamento de erro
        res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await transactionService.remove(id);
        res.status(204).send();
    } catch (error) {
        // Lógica de tratamento de erro
        res.status(500).json({ error: error.message });
    }
};  
module.exports = { getAll, create, remove };