import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text as RNText,
} from "react-native";
import { useRouter } from "expo-router";
import { Transaction } from "@/types/Transaction";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import { getUser, removeUser } from "@/services/storage";
import { apiRequest } from "@/services/api";
import { Text } from "@/components/Themed";

export default function DashboardScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Usuário");

  // Carrega usuário e transações
  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUser();
        if (!user) {
          router.replace("/auth/login");
          return;
        }

        setUserName(user.name || "Usuário");

        // 🟢 Agora enviamos o userId na requisição
        const data = await apiRequest(`/transactions?userId=${user.id}`, "GET");

        const mappedData: Transaction[] = (data || []).map((t: any) => ({
          id: t.id,
          description: t.description || "Sem descrição",
          amount: Number(t.amount),
          date: t.date,
          type: t.type === "income" ? "income" : "expense",
          category: t.category?.name || "Outros",
        }));

        setTransactions(mappedData);
        setError(null);
      } catch (err: any) {
        console.error("Erro ao carregar transações:", err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await removeUser();
      Alert.alert("Logout", "Você saiu da sua conta.");
      router.replace("/auth/login");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4695a0ff" />
        <RNText>Carregando...</RNText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => router.reload()}
        >
          <Text style={styles.reloadText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard de {userName}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Gráfico de categorias */}
      <CategoryChart transactions={transactions} />

      {/* Lista de transações */}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
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
