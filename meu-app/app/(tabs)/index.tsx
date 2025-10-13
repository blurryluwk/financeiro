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
// Importamos a interface Transaction corrigida (category: string)
import { Transaction } from "@/types/Transaction"; 
import CategoryChart from "@/components/CategoryChart";
import TransactionList from "@/components/TransactionList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { fetchTransactions } from "@/services/transactionsService";

// Não precisamos mais de TransactionState se a Transaction for ajustada!

export default function DashboardScreen() {
  // O estado usa a interface Transaction, que agora é compatível
  const [transactions, setTransactions] = useState<Transaction[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>("Usuário");
  const router = useRouter();

  // buscar transações do backend
  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Assumindo que o fetchTransactions retorna Array<TransactionAPI>
      const apiData: any[] = await fetchTransactions(); 
      
      // 🛑 CORREÇÃO CRÍTICA: Mapeamento para extrair a STRING 'category.name'
      const mappedData: Transaction[] = (Array.isArray(apiData) ? apiData : [])
            .map(t => ({
                id: t.id,
                description: t.description || "Sem descrição",
                amount: t.amount,
                date: t.date,
                type: t.type,
                // ESSENCIAL: O nome da chave 'category' agora recebe a string 'name'
                category: t.category?.name || "Outros", 
                // Qualquer outra propriedade que a interface Transaction espera
            }));

      setTransactions(mappedData);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar transações:", err);
      setError(err.message || "Não foi possível carregar as transações.");
    } finally {
      setLoading(false);
    }
  };
// ... (restante do código useEffects e handleLogout)

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

      {/* Gráfico de categorias */}
      <CategoryChart transactions={transactions} />

      {/* Lista de transações */}
      <TransactionList
        // Não precisa de mapeamento adicional aqui se a prop 'category' for string
        transactions={transactions.map((t) => ({
          ...t,
          description: t.description || "Sem descrição",
        }))}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
// ... (Estilos mantidos inalterados)
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