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
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.subtitle}>Transações recentes</Text>
      {transactions.map((t) => (
        <TransactionCard
          key={t.id}
          description={String(t.description || "Sem descrição")}
          category={String(t.category?.name || "Outros")}
          amount={Number(t.amount || 0)}
          date={String(t.date || "")}
          type={t.type === "income" ? "income" : "expense"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
