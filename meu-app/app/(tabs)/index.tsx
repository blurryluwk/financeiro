import React from "react";
import { StyleSheet, ScrollView, Dimensions } from "react-native";
import { Text } from "@/components/Themed";
import { PieChart } from "react-native-chart-kit";
import TransactionCard from "@/components/TransactionCard";
import { transactions, Transaction } from "@/constants/transactions";

export default function TabOneScreen() {
  const screenWidth = Dimensions.get("window").width;

  // agrupa despesas por categoria
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      const cat = t.category || "Outros";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    }
  });

  const colors = [
    "#ffe056ff",
    "#e45a5aff",
    "#99ca3cff",
    "#0f65b6",
    "#8d3dad",
    "#70e6d6ff",
  ];

  // um item por categoria
  const chartData = Object.keys(categoryTotals).map((cat, i) => ({
    name: cat,
    amount: categoryTotals[cat],
    // fallback: se a cor for indefinida, use '#000000'
    color: colors[i % colors.length] || "#000000",
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  //configuração básica do gráfico ***
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
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <Text style={styles.subtitle}>Gastos por categoria</Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          accessor="amount"
          // *** PASSE O CONFIG AQUI ***
          chartConfig={chartConfig}
          // ***
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Nenhum gasto registrado
        </Text>
      )}

      <Text style={[styles.subtitle, { marginTop: 20 }]}>
        Transações recentes
      </Text>
      {transactions.map((t: Transaction, i: number) => (
        <TransactionCard key={i} {...t} />
      ))}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
});
