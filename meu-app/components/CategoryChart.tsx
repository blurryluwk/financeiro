import React, { useMemo } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Transaction } from "@/types/Transaction";

const screenWidth = Dimensions.get("window").width;

interface CategoryChartProps {
  transactions?: Transaction[]; // agora pode ser undefined
}

export default function CategoryChart({ transactions }: CategoryChartProps) {
  // Garante que transactions sempre seja um array
  const safeTransactions = transactions ?? [];

  const chartData = useMemo(() => {
    const totals: Record<string, number> = {};

    safeTransactions.forEach((t) => {
      if (t.type === "expense") {
        const cat = t.category?.name || "Outros";
        totals[cat] = (totals[cat] || 0) + (t.amount || 0);
      }
    });

    const colors = [
      "#134692ff",
      "#1a96a7ff",
      "#8fccb6ff",
      "#ffeaccff",
      "#ff995eff",
      "#ff6f91ff",
      "#de1d6aff",
      "#5f335fff",
      "#a64ca6ff",
    ];

    return Object.keys(totals).map((cat, i) => ({
      name: cat,
      amount: totals[cat],
      color: colors[i % colors.length],
      legendFontColor: "#333",
      legendFontSize: Math.round(screenWidth * 0.035),
      legendFontFamily: "System",
    }));
  }, [safeTransactions]);

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.subtitle}>Gastos por categoria</Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={screenWidth * 0.6}
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
