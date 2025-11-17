// src/controllers/NotificationController.js
import NotificationService from "./../services/notificationService.js";

const NotificationController = {
  /**
   * Lista as notificações do usuário logado.
   * Assume que o middleware de autenticação adicionou o 'userId' ao objeto req (req.userId).
   */
  listNotifications: async (req, res) => {
    // userId viria do token JWT, injetado por um middleware de autenticação
    const userId = req.userId; // Exemplo: Supondo que o token é decodificado e o ID é injetado
    const { page, pageSize } = req.query; // Parâmetros de paginação

    console.log(`📩 Requisição para listar notificações. User ID: ${userId}, Page: ${page}, PageSize: ${pageSize}`);

    // ⚠️ Validação de Segurança/Existência do Usuário
    if (!userId) {
      return res.status(401).json({ error: "Não autorizado. ID de usuário não fornecido." });
    }

    try {
      const data = await NotificationService.listUserNotifications({
        userId,
        page,
        pageSize,
      });

      console.log(`✅ ${data.notifications.length} notificações listadas.`);
      return res.json(data);
    } catch (error) {
      console.error("🔥 Erro no listNotifications:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Erro interno ao listar notificações" });
    }
  },

  /**
   * Marca uma ou mais notificações como lidas.
   * Assume que o middleware de autenticação adicionou o 'userId' ao objeto req.
   */
  markAsRead: async (req, res) => {
    // userId viria do token JWT
    const userId = req.userId; // Exemplo: Supondo que o token é decodificado e o ID é injetado
    const { notificationIds } = req.body; // Pode ser um ID único (number) ou um array de IDs ([number, number])

    console.log(`📩 Requisição para marcar como lida. User ID: ${userId}, IDs: ${notificationIds}`);

    if (!userId) {
      return res.status(401).json({ error: "Não autorizado. ID de usuário não fornecido." });
    }
    
    // ⚠️ Validação da Entrada
    if (!notificationIds || (Array.isArray(notificationIds) && notificationIds.length === 0)) {
        return res.status(400).json({ error: "É necessário fornecer um ou mais IDs de notificação." });
    }

    try {
      const updatedCount = await NotificationService.markAsRead({
        userId,
        notificationIds,
      });

      console.log(`✅ ${updatedCount} notificações marcadas como lidas com sucesso.`);
      return res.json({
        message: `${updatedCount} notificações marcadas como lidas.`,
        updatedCount,
      });
    } catch (error) {
      console.error("🔥 Erro no markAsRead:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Erro interno ao marcar notificações como lidas" });
    }
  },
};

export default NotificationController;