import * as TransactionRepository from "../repositories/transactionRepository.js";

const TransactionService = {
  /**
   * Listar todas as transações de um usuário
   * @param {number} userId
   */
  list: async (userId) => {
    if (!userId) throw { status: 400, message: "userId é obrigatório" };
    return await TransactionRepository.findAll(userId);
  },

  /**
   * Buscar transação por ID
   * @param {number} id
   */
  get: async (id) => {
    const transaction = await TransactionRepository.findById(id);
    if (!transaction)
      throw { status: 404, message: "Transação não encontrada" };
    return transaction;
  },

  /**
   * Criar nova transação
   * @param {Object} data - Deve conter description, amount, type, categoryId, userId, date
   */
  create: async (data) => {
    console.log("CHEGOU NO SERVICE APÓS VALIDAÇÃO:", data);

    const description = data.description;
    const amount = data.amount;
    const type = data.type;
    const categoryId = Number(data.categoryId);
    const userId = Number(data.userId);
    const date = data.date;

    if (
      !description ||
      isNaN(amount) ||
      !type ||
      isNaN(categoryId) ||
      isNaN(userId) ||
      !date
    ) {
      throw {
        status: 400,
        message:
          "Preencha todos os campos corretamente (IDs e valor devem ser números).",
      };
    }

    const dataParaPrisma = {
      description,
      amount,
      type,
      date: new Date(date),
      category: { connect: { id: categoryId } },
      user: { connect: { id: userId } },
    };

    return await TransactionRepository.create(dataParaPrisma);
  },

  /**
   * Atualizar transação
   * @param {number} id
   * @param {Object} data
   */
  update: async (id, data) => {
    const updated = await TransactionRepository.update(id, data);
    if (!updated) throw { status: 404, message: "Transação não encontrada" };
    return updated;
  },

  /**
   * Deletar transação
   * @param {number} id
   */
  delete: async (id) => {
    const deleted = await TransactionRepository.deleteById(id);
    if (!deleted) throw { status: 404, message: "Transação não encontrada" };
    return { message: "Transação removida com sucesso" };
  },
};

export default TransactionService;
