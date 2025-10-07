import React, { useEffect } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/Themed";
import { transactions } from "@/constants/transactions";
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();

  // 🔐 Verifica se o usuário está logado
  useEffect(() => {
    async function checkLogin() {
      const user = await AsyncStorage.getItem("@user");
      if (!user) {
        router.replace("/login"); // se não estiver logado, redireciona
      }
    }
    checkLogin();
  }, []);

  // 🚪 Função de logout
  async function handleLogout() {
    await AsyncStorage.removeItem("@user");
    Alert.alert("Logout", "Você saiu da sua conta.");
    router.replace("/login");
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* 1. Gráfico de categorias */}
      <CategoryChart transactions={transactions} />

      {/* 2. Lista de transações */}
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
  title: {
    fontSize: 24,
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
});
