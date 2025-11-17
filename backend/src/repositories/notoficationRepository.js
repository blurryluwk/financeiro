// src/repositories/NotificationRepository.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class NotificationRepository {
  /**
   * Cria uma nova notificação.
   * @param {number} userId - ID do usuário.
   * @param {object} data - Dados da notificação (type, title, body, link_url, metadata).
   * @returns {Promise<object>} Nova notificação criada.
   */
  async create(userId, data) {
    return prisma.notification.create({
      data: {
        user_id: userId,
        ...data,
      },
    });
  }

  /**
   * Busca todas as notificações de um usuário, com paginação opcional.
   * @param {number} userId - ID do usuário.
   * @param {number} [skip=0] - Número de registros para pular.
   * @param {number} [take=10] - Número de registros a serem retornados.
   * @returns {Promise<object[]>} Lista de notificações.
   */
  async findByUserId(userId, skip = 0, take = 10) {
    return prisma.notification.findMany({
      where: { user_id: userId },
      skip: skip,
      take: take,
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Marca uma ou mais notificações como lidas.
   * @param {number | number[]} notificationIds - ID(s) da notificação.
   * @returns {Promise<number>} Número de registros atualizados.
   */
  async markAsRead(notificationIds) {
    const idsArray = Array.isArray(notificationIds) ? notificationIds : [notificationIds];

    const { count } = await prisma.notification.updateMany({
      where: {
        id: { in: idsArray },
      },
      data: {
        is_read: true,
      },
    });
    
    return count;
  }

  /**
   * Busca o número total de notificações não lidas para um usuário.
   * @param {number} userId - ID do usuário.
   * @returns {Promise<number>} Contagem de notificações não lidas.
   */
  async countUnread(userId) {
    return prisma.notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
  }
}

export default new NotificationRepository();