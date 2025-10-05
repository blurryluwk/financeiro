// components/TransactionList.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "@/components/Themed";
import TransactionCard from "@/components/TransactionCard";
import { Transaction } from "@/constants/transactions";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <>
      <Text style={styles.subtitle}>Transações recentes</Text>
      {transactions.map((t: Transaction, i: number) => (
        <TransactionCard key={i} {...t} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    marginTop: 20, // Mantido o espaçamento extra para seguir o layout original
  },
});