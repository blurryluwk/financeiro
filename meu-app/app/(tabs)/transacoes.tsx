import React, { useState, useMemo } from "react";
// Importe Alert do react-native
import { StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Text, View } from "@/components/Themed";

import TransactionCard from "@/components/TransactionCard";
import { TransactionCategory } from '@/constants/transactions';
import {
  transactions as initialTransactions,
  Transaction,
} from "@/constants/transactions";
import FilterModal from "@/components/FilterModal";
import { FilterState } from "@/components/TransactionFilter";
import NewTransactionModal, {
  NewTransactionData,
} from "@/components/NewTransactionModal";

export default function TabOneScreen() {
  const [currentTransactions, setCurrentTransactions] =
    useState(initialTransactions); // gerenciamento dos filtros aplicados

  const [filter, setFilter] = useState<FilterState>({
    type: "all",
    category: "all",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewTransactionModalVisible, setIsNewTransactionModalVisible] =
    useState(false); // aplicar as seleções

  const handleApplyFilter = (newFilter: FilterState) => {
    setFilter(newFilter);
  };

  const availableCategories = useMemo(() => {
    // currentTransactions para coletar categorias
    const allCategories = currentTransactions
      .map((t) => t.category)
      .filter(
        (value, index, self) => self.indexOf(value) === index && value
      ) as string[];

    return allCategories.sort();
  }, [currentTransactions]); // CORREÇÃO: Adiciona currentTransactions às dependências // recalcula a lista de transações a ser exibida

  const filteredTransactions = useMemo(() => {
    // CORREÇÃO: Filtra a lista currentTransactions
    return currentTransactions.filter((t: Transaction) => {
      const typeMatch = filter.type === "all" || t.type === filter.type;
      const categoryMatch =
        filter.category === "all" || t.category === filter.category;

      return typeMatch && categoryMatch;
    });
  }, [currentTransactions, filter]); // CORREÇÃO: Adiciona currentTransactions às dependências

  const handleSaveNewTransaction = (data: NewTransactionData) => {
    // cria a nova transação
    const newTransaction: Transaction = {
      ...data,
      date: new Date().toLocaleDateString("pt-BR"), // DD/MM/YYYY
    }; // adiciona a nova transação ao topo da lista

    setCurrentTransactions((prevTransactions) => [
      newTransaction,
      ...prevTransactions,
    ]);

    Alert.alert(
      "Sucesso!",
      `Transação de R$ ${newTransaction.amount.toFixed(2)} salva.`, // fecha o modal
      [{ text: "OK", onPress: () => setIsNewTransactionModalVisible(false) }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Container que alinha Título e Botão */}
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <View style={styles.headerButtons}>
          {/* CORREÇÃO: Adicionado Botão de Nova Transação */}
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => setIsNewTransactionModalVisible(true)}
          >
            <Text style={styles.newButtonText}>+</Text>
          </TouchableOpacity>

          {/* Botão para abrir o Modal de Filtro */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.filterButtonText}>Filtrar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredTransactions} // Usa a lista FILTRADA
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TransactionCard
            description={item.description}
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
            Nenhuma transação encontrada com os filtros atuais.{" "}
          </Text>
        )}
      />
      {/* Modal de Filtro */}{" "}
      <FilterModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
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
  headerButtons: {
    // CORREÇÃO: Novo estilo para agrupar os botões
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#4695a0ff", // Cor de destaque para o botão
    borderRadius: 8,
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  newButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#8fccb6ff",
    borderRadius: 8,
    marginRight: 10, // Ajuste fino para centralizar o '+'
    justifyContent: "center",
    alignItems: "center",
  },
  newButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 28,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
});
