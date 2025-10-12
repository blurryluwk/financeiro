// components/TransactionList.tsx

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import TransactionCard from "@/components/TransactionCard";
import { Transaction } from "@/types/Transaction";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>;
  }

  return (
    <View>
      <Text style={styles.subtitle}>Transações recentes</Text>
      {transactions.map((t) => (
        <TransactionCard
          key={t.id}
          {...t}
          description={t.description || "Sem descrição"} // garante tipagem segura
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
