// TabOneScreen.tsx
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import TransactionCard from "@/components/TransactionCard";
import FilterModal from "@/components/FilterModal";
import NewTransactionModal, {
  NewTransactionData,
} from "@/components/NewTransactionModal";
import { FilterState } from "@/components/TransactionFilter";
import { apiRequest } from "@/services/api";

// 1. INTERFACES CORRIGIDAS (Mantidas inalteradas)
export interface CategoryResponse {
  id: number;
  name: string;
  user_id: number; 
}

// Interface que reflete o que o BACKEND retorna com 'include: { category: true }'
export interface TransactionAPI {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: CategoryResponse; 
}

// Interface que será usada no ESTADO 'transactions'
export interface TransactionState {
    id: number;
    description: string;
    amount: number;
    date: string;
    type: "income" | "expense";
    categoryName: string; // <-- Apenas a string do nome da categoria
}

export default function TabOneScreen() {
  // Estado para armazenar os OBJETOS de categoria (nome e ID)
  // Usamos 'any' aqui para simplificar, mas o ideal seria usar CategoryResponse[]
  const [apiCategories, setApiCategories] = useState<CategoryResponse[]>([]);
    
  // O estado 'transactions' agora usa a nova interface
  const [categories, setCategories] = useState<string[]>([]); // Lista de nomes para o Filtro
  const [transactions, setTransactions] = useState<TransactionState[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    type: "all",
    category: "all",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isNewTransactionModalVisible, setIsNewTransactionModalVisible] =
    useState(false);

  const router = useRouter();

  // 🛑 NOVO useMemo: Cria um mapa de Nome -> ID para uso no handleSaveNewTransaction
  const categoryNameToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    apiCategories.forEach(cat => {
      if (cat.name) {
        map.set(cat.name, cat.id);
      }
    });
    return map;
  }, [apiCategories]);


  // Logout (mantido inalterado)
  const handleLogout = async () => {
    await AsyncStorage.removeItem("@user");
    Alert.alert("Logout", "Você saiu da sua conta.");
    router.replace("/login");
  };

  // Buscar transações do usuário
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const userJson = await AsyncStorage.getItem("@user");
      if (!userJson) throw new Error("Usuário não logado");
      const user = JSON.parse(userJson);

      // Recebemos os dados brutos com o objeto 'category'
      const apiData: TransactionAPI[] = await apiRequest(
        `/transactions?userId=${user.id}`,
        "GET"
      );

      // Mapeamento para garantir que a categoria seja uma STRING (categoryName)
      const safeData: TransactionState[] = apiData.map((t) => ({
        ...t,
        type: t.type === "income" || t.type === "expense" ? t.type : "expense",
        description: t.description || "Sem descrição",
        categoryName: t.category?.name || "Outros", 
      }));

      setTransactions(safeData);
      setError(null);
      
      // 🛑 NOVO: Extrai e armazena os OBJETOS de categoria (para o Mapa)
      const uniqueCategoryObjects = apiData
        .map(t => t.category)
        .filter((cat, index, self) => cat && index === self.findIndex(c => c?.id === cat?.id));
      
      setApiCategories(uniqueCategoryObjects as CategoryResponse[]);
      
      // Também atualiza as categorias disponíveis para o filtro (lista de nomes)
      const uniqueCategoryNames = Array.from(new Set(safeData.map(t => t.categoryName)));
      setCategories(uniqueCategoryNames);

    } catch (err: any) {
      console.error("Erro ao buscar transações:", err);
      setError(err.message || "Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleApplyFilter = (newFilter: FilterState) => {
    setFilter(newFilter);
    setIsFilterModalVisible(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const typeMatch = filter.type === "all" || t.type === filter.type;
      
      // Compara o filtro com a string categoryName
      const categoryMatch =
        filter.category === "all" || t.categoryName === filter.category;
        
      return typeMatch && categoryMatch;
    });
  }, [transactions, filter]);

  const handleSaveNewTransaction = async (data: NewTransactionData) => {
    try {
      const userJson = await AsyncStorage.getItem("@user");
      if (!userJson) throw new Error("Usuário não logado");
      const user = JSON.parse(userJson);
      
      // 🛑 CORREÇÃO CRÍTICA: Busca o ID da categoria usando o nome (data.category)
      const categoryId = categoryNameToIdMap.get(data.category);

      if (categoryId === undefined) {
          throw new Error(`ID da categoria '${data.category}' não encontrado.`);
      }

      const payload = { 
          ...data, 
          // 🛑 SUBSTITUI 'category' (string) por 'categoryId' (number)
          categoryId: categoryId, 
          userId: Number(user.id) // Garante que o ID do usuário é um número
      };

      // Remove a propriedade 'category' do payload, pois o backend espera 'categoryId'
      delete (payload as any).category;

      await apiRequest("/transactions", "POST", payload);

      Alert.alert("Sucesso", "Transação salva com sucesso!");
      setIsNewTransactionModalVisible(false);
      
      // Recarregar os dados do backend após o salvamento
      loadTransactions(); 
      
    } catch (err: any) {
      // Tratamento de erro
      let errorMessage = "Não foi possível salvar a transação. Detalhes: " + (err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err)));
      console.error("Erro ao salvar transação:", err);
      Alert.alert("Erro", errorMessage);
    }
  };

  if (loading) {
// ... (Renderização de Loading)
// ...
  }

  if (error) {
// ... (Renderização de Erro)
// ...
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
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionCard
            description={item.description}
            amount={item.amount}
            date={item.date}
            type={item.type}
            // Passa apenas a string 'categoryName'
            category={item.categoryName} 
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
        )}
      />

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        currentFilter={filter}
        onApply={handleApplyFilter}
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
// ... (Estilos mantidos inalterados)
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#f2f2f2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerButtons: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#4695a0ff",
    borderRadius: 8,
  },
  filterButtonText: { color: "#fff", fontWeight: "bold" },
  newButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#8fccb6ff",
    borderRadius: 8,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  newButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 28,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  reloadButton: {
    backgroundColor: "#4695a0ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reloadText: { color: "#fff", fontWeight: "600" },
});