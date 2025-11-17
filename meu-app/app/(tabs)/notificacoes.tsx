// notificacoes.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import { getToken } from '../../services/auth'; 
import NotificationService, { Notification } from '../../services/notification'; 

interface NotificationItemProps {
  item: Notification;
  onPress: (id: number, linkUrl: string | null) => void; // Ação de clique agora passa o linkUrl
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onPress }) => {
  const isUnread = !item.is_read;
  
  const handlePress = () => {
    // Chama o onPress principal, passando o ID e o link
    onPress(item.id, item.link_url);
  };

  return (
    <TouchableOpacity 
      style={[styles.item, isUnread && styles.itemUnread]} 
      onPress={handlePress}
    >
      <Text style={[styles.itemTitle, isUnread && { fontWeight: 'bold' }]}>{item.title}</Text>
      <Text style={styles.itemBody}>{item.body}</Text>
      <Text style={styles.itemDate}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};


// --- Tela Principal de Notificações (ALTERADA) ---
export default function NotificacoesScreen() {
  const router = useRouter(); // <-- INSTÂNCIA DO ROUTER
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true); 
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true); 

  // Função de busca das notificações (Sem alteração)
  const fetchNotifications = useCallback(async (pageToLoad: number) => {
    const token = await getToken(); 
    
    if (!token) {
      console.warn("Usuário não autenticado. Token não encontrado.");
      setLoading(false);
      return; 
    }
    
    setLoading(true);
    try {
      const data = await NotificationService.listUserNotifications(pageToLoad, 10);
      
      setNotifications(prev => 
        pageToLoad === 1 ? data.notifications : [...prev, ...data.notifications]
      );
      setUnreadCount(data.metadata.unreadCount);

    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, []); 

  // Função para marcar como lida E NAVEGAR (ALTERADA)
  const handleNotificationClick = useCallback(async (id: number, linkUrl: string | null) => {
    const token = await getToken(); 
    if (!token) return; 

    // 1. Marca como lida no servidor (se ainda não estiver)
    const notificationToUpdate = notifications.find(n => n.id === id);

    if (notificationToUpdate && !notificationToUpdate.is_read) {
        try {
            await NotificationService.markAsRead(id);
            
            // 2. Atualiza o estado local
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
            );
            setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
            
        } catch (error) {
            console.error("Erro ao marcar como lida:", error);
        }
    }
    
    // 3. NAVEGAÇÃO usando Expo Router
    if (linkUrl) {
    console.log(`Navegando para: ${linkUrl}`);
    router.push(linkUrl as any);
}
  }, [router, notifications]);

  // Carrega a primeira página ao montar a tela
  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]); 

  
  if (loading && notifications.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando notificações...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Notificações</Text>
      <Text style={styles.subtitle}>Você tem **{unreadCount}** notificações não lidas.</Text>
      
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>Você não tem nenhuma notificação.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationItem 
              item={item} 
              onPress={handleNotificationClick} // <-- Passa a nova função de clique
            />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... Seus estilos permanecem os mesmos ...
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingText: {
      marginTop: 20,
      fontSize: 16,
      color: '#333',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  // Estilos do Item
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    position: 'relative',
  },
  itemUnread: {
    backgroundColor: '#e6f7ff', 
    borderLeftWidth: 4,
    borderLeftColor: '#1890ff',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemBody: {
    fontSize: 14,
    color: '#333',
  },
  itemDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  unreadDot: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4d4f', 
  },
});