import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
  Text,
} from "react-native";

import TransactionCard from "@/components/TransactionCard";
import FilterModal from "@/components/FilterModal";
import NewTransactionModal, {
  NewTransactionData,
} from "@/components/NewTransactionModal";
import { FilterState } from "@/components/TransactionFilter";
import { apiRequest } from "@/services/api";
import { Transaction } from "@/types/Transaction";

export default function TabOneScreen() {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [currentTransactions, setCurrentTransactions] = useState<Transaction[]>(
    []
  );
  const [filter, setFilter] = useState<FilterState>({
    type: "all",
    category: "all",
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isNewTransactionModalVisible, setIsNewTransactionModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Buscar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data: { name: string }[] = await apiRequest("/categories");
        setAvailableCategories(data.map((c) => c.name));
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        setAvailableCategories(["Outros"]);
      }
    };
    loadCategories();
  }, []);

  // 🔹 Buscar transações
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data: Transaction[] = await apiRequest("/transactions");
      setCurrentTransactions(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
      setError("Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // 🔹 Aplicar filtro
  const handleApplyFilter = (newFilter: FilterState) => {
    setFilter(newFilter);
    setIsFilterModalVisible(false);
  };

  // 🔹 Lista filtrada
  const filteredTransactions = useMemo(() => {
    return currentTransactions.filter((t) => {
      const typeMatch = filter.type === "all" || t.type === filter.type;
      const categoryMatch =
        filter.category === "all" || t.category === filter.category;
      return typeMatch && categoryMatch;
    });
  }, [currentTransactions, filter]);

  // 🔹 Adicionar nova transação
  const handleSaveNewTransaction = (data: NewTransactionData) => {
    const newTransaction: Transaction = {
      ...data,
      id: Date.now(), // ID temporário (backend deve retornar real)
    };
    setCurrentTransactions((prev) => [newTransaction, ...prev]);
    Alert.alert(
      "Sucesso!",
      `Transação de R$ ${newTransaction.amount.toFixed(2)} salva.`,
      [{ text: "OK", onPress: () => setIsNewTransactionModalVisible(false) }]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4695a0ff" />
        <Text>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.reloadButton}
          onPress={loadTransactions}
        >
          <Text style={styles.reloadText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Lista de transações */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionCard
            description={item.description || "Sem descrição"}
            amount={item.amount}
            date={item.date}
            type={item.type}
            category={item.category}
          />
        )}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            Nenhuma transação encontrada com os filtros atuais.
          </Text>
        )}
      />

      {/* Modais */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        currentFilter={filter}
        onApply={handleApplyFilter}
        availableCategories={availableCategories}
      />

      <NewTransactionModal
        isVisible={isNewTransactionModalVisible}
        onClose={() => setIsNewTransactionModalVisible(false)}
        onSave={handleSaveNewTransaction}
        availableCategories={availableCategories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  list: { flex: 1 },
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
