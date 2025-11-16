import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  Alert,
  Modal, // Importação necessária para o Modal Customizado
} from "react-native";
import { useRouter } from "expo-router";
import TransactionCard from "@/components/TransactionCard";
import FilterModal from "@/components/FilterModal";
import NewTransactionModal, { NewTransactionData } from "@/components/NewTransactionModal";
import { FilterState } from "@/components/TransactionFilter";
import { authRequest, getUser, logout } from "@/services/auth";

// Interfaces (Mantenha as interfaces existentes)
export interface CategoryResponse {
  id: number;
  name: string;
  user_id: number;
}

export interface TransactionAPI {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: CategoryResponse;
}

export interface TransactionState {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  categoryName: string;
  categoryId: number;
}

// ----------------------------------------------------------------------
// COMPONENTE DE MODAL DE CONFIRMAÇÃO CUSTOMIZADO
// ----------------------------------------------------------------------

interface ConfirmationModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
}) => (
  <Modal animationType="fade" transparent visible={isVisible}>
    <View style={confirmationStyles.overlay}>
      <View style={confirmationStyles.modalView}>
        <Text style={confirmationStyles.title}>{title}</Text>
        <Text style={confirmationStyles.message}>{message}</Text>
        <View style={confirmationStyles.actions}>
          <TouchableOpacity style={confirmationStyles.cancelButton} onPress={onCancel}>
            <Text style={confirmationStyles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={confirmationStyles.confirmButton} onPress={onConfirm}>
            <Text style={confirmationStyles.confirmButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const confirmationStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    confirmButton: {
        backgroundColor: '#ff3b30', // Vermelho para exclusão
        padding: 10,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
});

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------

export default function TabOneScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionState[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [apiCategories, setApiCategories] = useState<CategoryResponse[]>([]);
  const [filter, setFilter] = useState<FilterState>({ type: "all", category: "all" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isNewTransactionModalVisible, setIsNewTransactionModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionState | null>(null);
  
  // 🔑 NOVOS ESTADOS PARA O MODAL DE CONFIRMAÇÃO CUSTOMIZADO
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState<number | null>(null);

  // Mapa Nome -> ID da categoria (Mantido)
  const categoryNameToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    apiCategories.forEach(cat => {
      if (cat.name) map.set(cat.name.toLowerCase().trim(), cat.id);
    });
    return map;
  }, [apiCategories]);

  // Carregar transações e categorias (Mantido)
  const loadTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await getUser();
      if (!user?.id) throw new Error("Usuário não logado");

      const allCategories: CategoryResponse[] = await authRequest(`/categories?userId=${user.id}`, "GET");
      setApiCategories(allCategories);
      setCategories(allCategories.map(c => c.name));

      const apiData: TransactionAPI[] = await authRequest(`/transactions?userId=${user.id}`, "GET");

      const safeData: TransactionState[] = apiData.map(t => ({
        id: t.id,
        description: t.description || "Sem descrição",
        amount: Number(t.amount),
        date: t.date,
        type: t.type === "income" ? "income" : "expense",
        categoryName: t.category?.name || "Outros",
        categoryId: t.category?.id || 0,
      }));

      setTransactions(safeData); 

    } catch (err: any) {
      console.error("Erro ao carregar transações:", err);
      setError(err.message || "Não foi possível carregar transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Filtrar (Mantido)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filter.type === "all" || t.type === filter.type;
      const categoryMatch = filter.category === "all" || t.categoryName === filter.category;
      return typeMatch && categoryMatch;
    });
  }, [transactions, filter]);


  // FUNÇÃO DE EXCLUSÃO (Passo 1: Apenas abre o modal) 🗑️
  const handleDeleteTransaction = (id: number) => {
    // Fecha o modal de edição (se estiver aberto por algum erro de fluxo)
    setIsNewTransactionModalVisible(false);
    setEditingTransaction(null);
    
    // Configura o modal de confirmação
    setTransactionIdToDelete(id);
    setIsConfirmationModalVisible(true);
  };
  
  // FUNÇÃO DE EXECUÇÃO DA EXCLUSÃO (Passo 2: Roda após a confirmação no modal)
  const executeDeleteTransaction = async () => {
    if (!transactionIdToDelete) return;

    const idToDelete = transactionIdToDelete; // Guarda o ID

    // 1. Fecha o modal de confirmação
    setIsConfirmationModalVisible(false); 
    setTransactionIdToDelete(null); // Limpa o estado imediatamente

    try {
      setLoading(true);
      await authRequest(`/transactions/${idToDelete}`, "DELETE");
      Alert.alert("Sucesso", "Transação excluída.");
      loadTransactions(); // Recarrega os dados
    } catch (err: any) {
      console.error("Erro ao excluir transação:", err);
      Alert.alert("Erro", "Não foi possível excluir a transação.");
    } finally {
      setLoading(false);
    }
  };


  // FUNÇÃO DE EDIÇÃO (Preparação) ✍️
  const handleEditTransaction = (transaction: TransactionState) => {
    setEditingTransaction(transaction);
    setIsNewTransactionModalVisible(true);
  };

  // FUNÇÃO SALVAR/ATUALIZAR (Unificada - Mantida)
  const handleSaveNewOrUpdateTransaction = async (data: NewTransactionData) => {
    try {
      const user = await getUser();
      if (!user?.id) throw new Error("Usuário não logado");

      type HttpMethod = "POST" | "GET" | "PUT" | "DELETE";

      const categoryId = categoryNameToIdMap.get(data.category.toLowerCase().trim());
      if (!categoryId) throw new Error(`Categoria '${data.category}' não encontrada.`);

      const payload = {
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type,
        categoryId: categoryId,
        userId: Number(user.id)
      };

      const isEditing = editingTransaction !== null;
      let endpoint = "/transactions";
      let method: HttpMethod = "POST"; 

      if (isEditing) {
        endpoint = `/transactions/${editingTransaction!.id}`;
        method = "PUT";
      }

      await authRequest(endpoint, method, payload);

      Alert.alert("Sucesso", isEditing ? "Transação atualizada!" : "Transação salva!");
      
      setIsNewTransactionModalVisible(false);
      setEditingTransaction(null); 
      loadTransactions();
      
    } catch (err: any) {
      console.error("Erro ao salvar/atualizar transação:", err);
      Alert.alert("Erro", err.message || "Não foi possível salvar/atualizar a transação.");
    }
  };

  // Logout (Mantido)
  const handleLogout = async () => {
     try {
       await logout();
       router.replace("/");
     } catch (e) {
       console.error("Erro no logout:", e);
     }
  };


  // Renderização de Estados de Carregamento/Erro (Mantido)
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4695a0ff" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando dados...</Text>
      </View>
    );
  }

  if (error && !transactions.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erro ao carregar dados: {error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadTransactions}>
          <Text style={styles.reloadText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => setIsNewTransactionModalVisible(true)}
          >
            <Text style={styles.newButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text style={styles.filterButtonText}>Filtrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionCard
            description={item.description}
            amount={item.amount}
            date={item.date}
            type={item.type}
            category={item.categoryName}
            onPress={() => handleEditTransaction(item)} 
            onDelete={() => handleDeleteTransaction(item.id)} // Chama a função que abre o modal customizado
          />
        )}
        ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
      />

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        currentFilter={filter}
        onApply={setFilter}
        availableCategories={categories}
      />

      <NewTransactionModal
        isVisible={isNewTransactionModalVisible}
        onClose={() => {
          setIsNewTransactionModalVisible(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveNewOrUpdateTransaction}
        initialData={editingTransaction ? {
            description: editingTransaction.description,
            amount: editingTransaction.amount,
            date: editingTransaction.date,
            type: editingTransaction.type,
            category: editingTransaction.categoryName,
        } : undefined}
      />
      
      {/* 🔑 NOVO MODAL DE CONFIRMAÇÃO */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        onConfirm={executeDeleteTransaction}
        onCancel={() => setIsConfirmationModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f2f2f2" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  headerButtons: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  filterButton: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: "#4695a0ff", borderRadius: 8 },
  filterButtonText: { color: "#fff", fontWeight: "bold" },
  newButton: { paddingHorizontal: 15, paddingVertical: 5, backgroundColor: "#8fccb6ff", borderRadius: 8, marginRight: 10, justifyContent: "center", alignItems: "center" },
  newButtonText: { color: "#333", fontWeight: "bold", fontSize: 24, lineHeight: 28 },
  logoutButton: { marginLeft: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#e92a20ff", borderRadius: 8 },
  logoutText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#666" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, textAlign: "center", marginBottom: 10 },
  reloadButton: { backgroundColor: "#4695a0ff", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  reloadText: { color: "#fff", fontWeight: "600" },
});