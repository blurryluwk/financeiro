import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text } from "@/components/Themed";
import { Transaction } from "@/types/Transaction";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { apiRequest } from "@/services/api";

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>("Usuário");
  const router = useRouter();

  // buscar transações do backend
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data: Transaction[] = await apiRequest("/transactions");
      setTransactions(data);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar transações:", err);
      setError("Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // verifica login e carrega nome do usuário
  useEffect(() => {
    async function loadUser() {
      const userData = await AsyncStorage.getItem("@user");

      if (!userData) {
        router.replace("/login");
        return;
      }

      const user = JSON.parse(userData);
      setUserName(user.name || "Usuário");
    }

    loadUser();
  }, []);

  // logout
  async function handleLogout() {
    await AsyncStorage.removeItem("@user");
    Alert.alert("Logout", "Você saiu da sua conta.");
    router.replace("/login");
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4695a0ff" />
        <Text>Carregando transações...</Text>
      </View>
    );
  }

  // Erro
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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Dashboard de {userName ? userName : "..."}
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* 1Gráfico de categorias */}
      <CategoryChart transactions={transactions} />

      {/* 2Lista de transações */}
      <TransactionList
        transactions={transactions.map((t) => ({
          ...t,
          description: t.description || "Sem descrição", // garante tipagem segura
        }))}
      />
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centered: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
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
  reloadText: { 
    color: "#fff", 
    fontWeight: "600" 
  },
});
