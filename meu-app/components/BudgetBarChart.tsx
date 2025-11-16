import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Animated } from "react-native";
import { Transaction } from "@/types/Transaction";
import { getUser } from "@/services/auth";
import { apiRequest } from "@/services/api";
import NewBudgetModal from "./NewBudgetModal";
import { Feather } from '@expo/vector-icons';

type Props = {
  transactions: Transaction[];
};

type BudgetItem = {
  id: number;
  amount: number;
};

export default function BudgetBarChart({ transactions }: Props) {
  const [budgets, setBudgets] = useState<{ [category: string]: BudgetItem }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animated values por categoria
  const [animatedValues, setAnimatedValues] = useState<{ [category: string]: Animated.Value }>({});

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

      const parsed: { [category: string]: BudgetItem } = {};
      (data || []).forEach((b: any) => {
        if (b.category?.name && b.id && b.amount != null) {
          parsed[b.category.name] = { id: b.id, amount: Number(b.amount) };
        }
      });

      setBudgets(parsed);

      // Inicializa Animated.Value para cada categoria
      const anims: { [category: string]: Animated.Value } = {};
      Object.keys(parsed).forEach(cat => {
        anims[cat] = new Animated.Value(0);
      });
      setAnimatedValues(anims);

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

  const getBarColor = (percent: number) => {
    if (percent > 100) return "#e92a20ff"; // vermelho
    if (percent > 75) return "#ff9500ff"; // laranja
    if (percent > 50) return "#f5e769ff"; // amarelo
    return "#69c44eff"; // verde
  };

  const handleAddBudget = async (data: { user_id: number; category_id: number; amount: number }) => {
    const payload = {
      userId: data.user_id,
      category: data.category_id,
      amount: data.amount,
    };
    await apiRequest("/budgets", "POST", payload);
    loadBudgets(); // recarrega os budgets após adicionar
  };

  const handleDeleteBudget = async (category: string) => {
    try {
      const budget = budgets[category];
      if (!budget?.id) return;

      await apiRequest(`/budgets/${budget.id}`, "DELETE");

      // Atualiza o state local removendo o budget deletado
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[category];
        return newBudgets;
      });

      // Remove o Animated.Value correspondente
      setAnimatedValues(prev => {
        const newAnims = { ...prev };
        delete newAnims[category];
        return newAnims;
      });
    } catch (err) {
      console.error("Erro ao deletar budget:", err);
    }
  };

  // Animação sequencial das barras
  useEffect(() => {
    const categories = Object.keys(animatedValues);
    categories.forEach((cat, index) => {
      const amount = budgets[cat]?.amount || 0;
      const spent = spentByCategory[cat] || 0;
      const percent = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

      Animated.timing(animatedValues[cat], {
        toValue: percent,
        duration: 800,
        delay: index * 150, // delay para animação em sequência
        useNativeDriver: false,
      }).start();
    });
  }, [animatedValues, budgets, spentByCategory]);

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
      <View style={styles.headerRow}>
        <Text style={styles.title}>Orçamentos por Categoria</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Adicionar novo orçamento"
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {Object.keys(budgets).map((category) => {
        const budget = budgets[category];
        const amount = budget?.amount || 0;
        const spent = spentByCategory[category] || 0;
        const percent = amount > 0 ? (spent / amount) * 100 : 0;

        return (
          <View key={category} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.category}>{category}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.value}>
                  R$ {spent.toFixed(2)} / R$ {amount.toFixed(2)}
                </Text>

                <Pressable
                  onPress={() => handleDeleteBudget(category)}
                  style={{ marginLeft: 10 }}
                  accessibilityLabel={`Excluir orçamento de ${category}`}
                >
                  <Feather name="trash-2" size={20} color="#585858ff" />
                </Pressable>
              </View>
            </View>

            <View style={styles.barBackground}>
              <Animated.View
                style={[
                  styles.barFill,
                  {
                    width: animatedValues[category]?.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }) || "0%",
                    backgroundColor: getBarColor(percent),
                  },
                ]}
              />
            </View>

            {percent > 100 && (
              <Text style={styles.exceededText}>
                ⚠️ Excedeu {Math.round(percent - 100)}% (R$ {(spent - amount).toFixed(2)})
              </Text>
            )}
          </View>
        );
      })}

      <NewBudgetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddBudget}
      />
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
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#b9b9b9ff",
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 24,
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
    color: "#e92a20ff",
    marginTop: 5,
    fontWeight: "600",
  },
});
