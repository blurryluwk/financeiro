import React from "react";
import { StyleSheet, View, Text } from "react-native";
import TransactionCard from "@/components/TransactionCard";
import { Transaction } from "@/types/Transaction";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;    // opcional, para editar
  onDelete?: (id: number) => void;               // opcional, para deletar
  showDeleteButton?: boolean;                     // opcional, exibir botão lixeira
}

export default function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete, 
  showDeleteButton = false 
}: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>;
  }

  return (
    <View style={{ marginVertical: 10 }}>
      {transactions.map((t) => (
        <TransactionCard
          key={t.id}
          description={String(t.description || "Sem descrição")}
          category={String(t.category?.name || "Outros")}
          amount={Number(t.amount || 0)}
          date={String(t.date || "")}
          type={t.type === "income" ? "income" : "expense"}
          onPress={() => onEdit ? onEdit(t) : undefined}   // Passa função de edição se houver
          onDelete={() => onDelete ? onDelete(t.id) : undefined} // Passa função de exclusão se houver
          showDelete={showDeleteButton} // Controla se o botão lixeira aparece
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
