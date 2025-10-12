import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Text, View } from "@/components/Themed";
import { Transaction } from "@/types/Transaction";
import { apiRequest } from "@/services/api"; 

const screenWidth = Dimensions.get("window").width;

export default function CategoryChart() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar transações da API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await apiRequest("/transactions");
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Agrupar despesas por categoria
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      const cat = t.category || "Outros";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    }
  });

  const colors = [
    "#4695a0ff",
    "#8fccb6ff",
    "#ffeaccff",
    "#ff995eff",
    "#de1d6aff",
    "#5f335fff",
  ];

  // Dados formatados para gráfico
  const chartData = Object.keys(categoryTotals).map((cat, i) => ({
    name: cat,
    amount: categoryTotals[cat],
    color: colors[i % colors.length] || "#000000",
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  // Visual do gráfico
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;
  }

  if (error) {
    return <Text style={styles.noDataText}>Erro: {error}</Text>;
  }

  return (
    <View>
      <Text style={styles.subtitle}>Gastos por categoria</Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          accessor="amount"
          chartConfig={chartConfig}
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>Nenhum gasto registrado</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
  },
});
