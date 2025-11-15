import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Transaction } from "@/types/Transaction";
import { getUser } from "@/services/auth";
import { apiRequest } from "@/services/api";

type Props = {
  transactions: Transaction[];
};

export default function BudgetBarChart({ transactions }: Props) {
  const [budgets, setBudgets] = useState<{ [category: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** carrega budgets do backend usando apiRequest */
  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getUser();
      if (!user?.id) {
        setError("Usuário inválido ao carregar budgets.");
        return;
      }

      const data = await apiRequest(`/budgets?userId=${user.id}`, "GET");

      const parsed: { [category: string]: number } = {};
      (data || []).forEach((b: any) => {
        parsed[b.category] = Number(b.limit);
      });

      setBudgets(parsed);
    } catch (err: any) {
      console.error("Erro ao carregar budgets:", err.message || err);
      setError("Erro ao carregar orçamentos do usuário.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  /** 🔹 Soma despesas por categoria */
  const spentByCategory = useMemo(() => {
    const map: { [cat: string]: number } = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        const cat = t.category?.name || "Outros";
        map[cat] = (map[cat] || 0) + Math.abs(t.amount);
      }
    });

    return map;
  }, [transactions]);

  /** 🔹 Cores das barras */
  const getBarColor = (percent: number) => {
    if (percent > 100) return "#ce1e15ff"; // vermelho
    if (percent > 75) return "#ff9500ff"; // laranja
    if (percent > 50) return "#fbff0aff"; // amarelo
    return "#69c44eff"; // verde
  };

 if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#4695a0" />
        <Text style={{ marginTop: 5 }}>Carregando orçamentos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingBox}>
        <Text style={{ color: "red", fontWeight: "600" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orçamentos por Categoria</Text>

      {Object.keys(budgets).map((category) => {
        const limit = budgets[category];
        const spent = spentByCategory[category] || 0;
        const percent = (spent / limit) * 100;
        const barWidth = Math.min(percent, 100);

        return (
          <View key={category} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.value}>
                R$ {spent.toFixed(2)} / R$ {limit.toFixed(2)}
              </Text>
            </View>

            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: `${barWidth}%`, backgroundColor: getBarColor(percent) },
                ]}
              />
            </View>

            {percent > 100 && (
              <Text style={styles.exceededText}>
                ⚠️ Excedeu {Math.round(percent - 100)}% (R$ {(spent - limit).toFixed(2)})
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBox: {
    marginTop: 20,
    padding: 10,
    alignItems: "center",
  },
  container: {
    marginTop: 25,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#333",
  },
  item: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    fontWeight: "600",
    fontSize: 15,
  },
  value: {
    fontSize: 14,
    color: "#666",
  },
  barBackground: {
    width: "100%",
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginTop: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 8,
  },
  exceededText: {
    color: "#ff3b30",
    marginTop: 5,
    fontWeight: "600",
  },
});