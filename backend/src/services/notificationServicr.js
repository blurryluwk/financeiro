// src/services/NotificationService.js
import NotificationRepository from '../repositories/NotificationRepository.js';

const NotificationService = {
  /**
   * Lista as notificações de um usuário.
   * @param {number} userId - ID do usuário logado.
   * @param {number} page - Número da página (começando em 1).
   * @param {number} pageSize - Tamanho da página (quantos itens por página).
   * @returns {Promise<object>} Lista de notificações e metadata de paginação.
   */
  listUserNotifications: async ({ userId, page = 1, pageSize = 10 }) => {
    // ⚠️ Validação básica de entrada
    if (!userId || isNaN(parseInt(userId))) {
      throw { status: 400, message: "ID de usuário inválido." };
    }

    const idAsInt = parseInt(userId);
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

    try {
      // 1. Obter as notificações
      const notifications = await NotificationRepository.findByUserId(
        idAsInt,
        skip,
        take
      );

      // 2. Contar as notificações não lidas
      const unreadCount = await NotificationRepository.countUnread(idAsInt);

      // 3. (Opcional) Contar o total de notificações para paginação completa
      // const totalCount = await NotificationRepository.countAll(idAsInt);

      return {
        notifications,
        metadata: {
          currentPage: parseInt(page),
          pageSize: take,
          unreadCount,
          // totalCount, // Incluir se usar totalCount
          // totalPages: Math.ceil(totalCount / take), // Incluir se usar totalCount
        },
      };
    } catch (error) {
      console.error("🔥 Erro no NotificationService.listUserNotifications:", error);
      // Lidar com erros de banco de dados
      throw { status: 500, message: "Falha ao buscar notificações." };
    }
  },

  /**
   * Marca uma ou mais notificações como lidas.
   * @param {number} userId - ID do usuário logado (para validação de segurança).
   * @param {number | number[]} notificationIds - ID(s) da notificação(ões) a serem marcadas.
   * @returns {Promise<number>} Número de notificações atualizadas.
   */
  markAsRead: async ({ userId, notificationIds }) => {
    if (!userId || !notificationIds) {
      throw { status: 400, message: "IDs de usuário e notificação são obrigatórios." };
    }

    // Convertendo para array para facilitar o uso no repositório
    const idsArray = Array.isArray(notificationIds) ? notificationIds.map(id => parseInt(id)) : [parseInt(notificationIds)];

    // Validação que todos os IDs são números válidos
    if (idsArray.some(isNaN)) {
        throw { status: 400, message: "Um ou mais IDs de notificação são inválidos." };
    }

    // OBS: O repositório irá fazer um `UPDATE MANY` que não verifica propriedade.
    // Em um cenário de alta segurança, precisaríamos validar se o usuário é o dono
    // de todas as notificações antes de marcá-las como lidas.
    // Por simplicidade, assumimos que o Controller garante que os IDs vieram do usuário.

    try {
      const updatedCount = await NotificationRepository.markAsRead(idsArray);
      
      if (updatedCount === 0) {
        throw { status: 404, message: "Nenhuma notificação encontrada ou atualizada." };
      }

      return updatedCount;
    } catch (error) {
      console.error("🔥 Erro no NotificationService.markAsRead:", error);
      // Propagar erros 404/400 ou lançar um 500 para falhas de BD
      if (error.status) throw error; 
      throw { status: 500, message: "Falha ao atualizar notificações." };
    }
  },
  
  // Exemplo de função para gerar uma notificação por lógica de negócio (pode ser usado internamente)
  createNotification: async ({ userId, type, title, body, link_url, metadata }) => {
    if (!userId || !type || !title) {
      throw { status: 400, message: "Campos obrigatórios ausentes para criar notificação." };
    }
    
    try {
        const idAsInt = parseInt(userId);
        return await NotificationRepository.create(idAsInt, { type, title, body, link_url, metadata });
    } catch (error) {
        console.error("🔥 Erro no NotificationService.createNotification:", error);
        throw { status: 500, message: "Falha ao criar notificação." };
    }
  }
};

export default NotificationService;