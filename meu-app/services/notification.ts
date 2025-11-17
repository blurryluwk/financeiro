// src/services/notificationService.ts (ou .js)

// Importa a função genérica que lida com token, URL base e erros.
import { apiRequest } from "./api"; 

export interface NotificationMetadata { 
  currentPage: number;
  pageSize: number;
  unreadCount: number;
}

export interface Notification { 
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  link_url: string | null;
  metadata: any; 
  created_at: string; 
}

interface NotificationListResponse {
  notifications: Notification[];
  metadata: NotificationMetadata;
}

const NotificationService = {
  /**
   * Lista as notificações do usuário logado.
   * Rota: GET /notifications
   * @param page Número da página a ser carregada (default: 1).
   * @param pageSize Quantidade de itens por página (default: 10).
   * @returns Lista de notificações e metadata.
   */
  listUserNotifications: async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<NotificationListResponse> => {
    // Note que a rota é passada sem o prefixo base, que é adicionado por apiRequest
    const endpoint = `/notifications?page=${page}&pageSize=${pageSize}`;

    console.log(`📡 Buscando notificações - Página ${page}...`);

    try {
      // Usando GET, sem corpo. apiRequest cuida do token.
      const data = await apiRequest(endpoint, "GET");
      
      console.log(`✅ Notificações da página ${page} carregadas com sucesso.`);
      return data as NotificationListResponse;

    } catch (error) {
      console.error("🚨 Falha ao listar notificações no front-end:", error);
      throw error;
    }
  },

  /**
   * Marca uma ou mais notificações como lidas.
   * Rota: PUT /notifications/read
   * @param notificationIds ID único (number) ou array de IDs (number[]) para marcar como lido.
   * @returns O número de notificações atualizadas.
   */
  markAsRead: async (
    notificationIds: number | number[]
  ): Promise<{ message: string; updatedCount: number }> => {
    const endpoint = `/notifications/read`;

    // Converte para array se for um único ID, para simplificar o Controller/Service.
    const idsArray = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    
    console.log(`📡 Marcando IDs como lido: ${idsArray.join(', ')}...`);

    try {
      // Usando PUT com o corpo (body) contendo os IDs.
      const data = await apiRequest(
        endpoint,
        "PUT",
        { notificationIds: idsArray }
      );
      
      console.log(`✅ ${data.updatedCount} notificações marcadas como lidas.`);
      return data;
      
    } catch (error) {
      console.error("🚨 Falha ao marcar notificações como lidas no front-end:", error);
      throw error;
    }
  },
};


export default NotificationService;