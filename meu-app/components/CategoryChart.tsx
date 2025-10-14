import React, { useMemo } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Transaction } from "@/types/Transaction";

const screenWidth = Dimensions.get("window").width;

interface CategoryChartProps {
  transactions: Transaction[];
}

export default function CategoryChart({ transactions }: CategoryChartProps) {
  // Agrupa despesas por categoria
  const chartData = useMemo(() => {
    const totals: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        const cat = t.category || "Outros";
        totals[cat] = (totals[cat] || 0) + (t.amount || 0);
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

    return Object.keys(totals).map((cat, i) => ({
      name: cat,
      amount: totals[cat],
      color: colors[i % colors.length],
      legendFontColor: "#333",
      legendFontSize: 14,
    }));
  }, [transactions]);

  return (
    <View style={{ marginVertical: 10 }}>
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
    marginBottom: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
