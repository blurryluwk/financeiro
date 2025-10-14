// TabOneScreen.tsx (limpo)
import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import TransactionCard from "@/components/TransactionCard";
import FilterModal from "@/components/FilterModal";
import NewTransactionModal, { NewTransactionData } from "@/components/NewTransactionModal";
import { FilterState } from "@/components/TransactionFilter";
import { authRequest, getUser, logout } from "@/services/auth";

// Interfaces
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

  // Mapa Nome -> ID da categoria
  const categoryNameToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    apiCategories.forEach(cat => {
      if (cat.name) map.set(cat.name, cat.id);
    });
    return map;
  }, [apiCategories]);

  // Logout
  const handleLogout = async () => {
    await logout();
    Alert.alert("Logout", "Você saiu da sua conta.");
    router.replace("/auth/login");
  };

  // Carregar transações e categorias
  const loadTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await getUser();
      if (!user?.id) throw new Error("Usuário não logado");

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

      const uniqueCategories = Array.from(
        new Map(apiData.map(t => [t.category.id, t.category])).values()
      ).filter(Boolean) as CategoryResponse[];

      setApiCategories(uniqueCategories);
      setCategories(uniqueCategories.map(c => c.name));
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

  // Filtrar
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filter.type === "all" || t.type === filter.type;
      const categoryMatch = filter.category === "all" || t.categoryName === filter.category;
      return typeMatch && categoryMatch;
    });
  }, [transactions, filter]);

  // Salvar nova transação (versão única)
  const handleSaveNewTransaction = async (data: NewTransactionData) => {
    try {
      const user = await getUser();
      if (!user?.id) throw new Error("Usuário não logado");

      const categoryId = categoryNameToIdMap.get(data.category);
      if (!categoryId) throw new Error(`Categoria '${data.category}' não encontrada`);

      const payload = { ...data, categoryId, userId: Number(user.id) };
      delete (payload as any).category;

      await authRequest("/transactions", "POST", payload);

      Alert.alert("Sucesso", "Transação salva com sucesso!");
      setIsNewTransactionModalVisible(false);
      loadTransactions();
    } catch (err: any) {
      console.error("Erro ao salvar transação:", err);
      Alert.alert("Erro", err.message || "Não foi possível salvar a transação.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4695a0ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadTransactions}>
          <Text style={styles.reloadText}>Tentar novamente</Text>
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
        onClose={() => setIsNewTransactionModalVisible(false)}
        onSave={handleSaveNewTransaction}
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
  logoutButton: { marginLeft: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#ff3b30", borderRadius: 8 },
  logoutText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#666" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, textAlign: "center", marginBottom: 10 },
  reloadButton: { backgroundColor: "#4695a0ff", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  reloadText: { color: "#fff", fontWeight: "600" },
});
