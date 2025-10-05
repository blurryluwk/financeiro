// app/(tabs)/index.tsx

import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/Themed";
import { transactions } from "@/constants/transactions";
// Importa os novos componentes:
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";

export default function TabOneScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* 1. Componente do Gráfico */}
      <CategoryChart transactions={transactions} />

      {/* 2. Componente da Lista de Transações */}
      <TransactionList transactions={transactions} />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});