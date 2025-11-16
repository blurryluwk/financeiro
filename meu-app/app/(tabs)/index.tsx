import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { getUser, logout, authRequest } from "@/services/auth";
import CategoryChart from "@/components/CategoryChart";
import BudgetBarChart from "@/components/BudgetBarChart";
import TransactionList from "@/components/TransactionList";
import { Text } from "@/components/Themed";
import { Transaction } from "@/types/Transaction";

export default function DashboardScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // 🔹 Carregar dados
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await getUser();
      if (!user?.id) {
        setError("Usuário inválido. Contate o suporte.");
        router.replace("/auth/login");
        return;
      }

      setUserName(user.name || "Usuário");

      const data = await authRequest(`/transactions?userId=${user.id}`, "GET");

      const mappedData: Transaction[] = (data || []).map((t: any) => ({
        id: t.id,
        description: t.description || "Sem descrição",
        amount: Number(t.amount),
        date: t.date,
        type: t.type === "income" ? "income" : "expense",
        category: {
          name: t.category?.name || t.category_name || "Outros",
        },
      }));

      setTransactions(mappedData);
    } catch (err: any) {
      console.error("Erro ao carregar transações:", err);
      setError("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 🔹 Atualizar dados sempre que a aba ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4695a0ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadData}>
          <Text style={styles.reloadText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard de {userName}</Text>
      </View>

      {/* Gráficos */}
      <CategoryChart transactions={transactions} />
      <BudgetBarChart transactions={transactions} />

      {/* Últimas 3 transações */}
      <View style={{ marginVertical: 20 }}>
        <Text style={styles.subtitle}>Transações Recentes</Text>
        {transactions.length > 0 ? (
          <TransactionList
            transactions={transactions
              .slice() // cria uma cópia
              .sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              ) // mais recentes primeiro
              .slice(0, 3) // pega apenas 3
            }
          />
        ) : (
          <Text style={styles.noDataText}>Nenhuma transação registrada</Text>
        )}
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
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
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "System",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
    fontFamily: "System",
  },
});
