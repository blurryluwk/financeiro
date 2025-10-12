// components/CategoryChart.tsx

import React from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Transaction } from "@/types/Transaction";

const screenWidth = Dimensions.get("window").width;

interface CategoryChartProps {
  transactions: Transaction[];
}

export default function CategoryChart({ transactions }: CategoryChartProps) {
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

// Configuração visual do gráfico
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
};

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
