const repository = require('../repositories/transactionRepository');
const validator = require('../../utils/validator');

const findAll = async () => {
    // talvez filtrar ou calcular algo antes de retornar
    return repository.findAll();
};

const create = async (data) => {
    if (!validator.isValid(data)) {
        throw new Error("Dados de transação inválidos.");
    }
    return repository.create(data);
};

const remove = async (id) => {
    return repository.remove(id);
}

module.exports = { findAll, create, remove };