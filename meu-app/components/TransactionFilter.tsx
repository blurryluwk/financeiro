import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

// Define o formato do objeto de filtro que a tela principal usará
export interface FilterState {
  type: "all" | "income" | "expense";
  category: string; // 'all' para mostrar todas as categorias
}

interface TransactionFilterProps {
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  // Recebe a lista de categorias disponíveis para criar os botões
  availableCategories: string[];
}

const TransactionFilter: React.FC<TransactionFilterProps> = ({
  filter,
  onFilterChange,
  availableCategories,
}) => {
  const { type, category } = filter;
  const types = [
    { label: "Todas", value: "all" },
    { label: "Receitas", value: "income" },
    { label: "Despesas", value: "expense" },
  ];

  const categories = ["Todas", ...availableCategories];

  const getStyle = (isActive: boolean) => ({
    ...styles.button,
    backgroundColor: isActive ? "#4695a0ff" : "#eee", // Cor de destaque
  });

  const getTextStyle = (isActive: boolean) => ({
    ...styles.buttonText,
    color: isActive ? "#fff" : "#333",
  });

  return (
    <View style={styles.container}>
      {/* Filtro por Tipo (Receita/Despesa) */}
      <Text style={styles.label}>Tipo de Transação:</Text>
      <View style={styles.typeContainer}>
        {types.map((t) => (
          <TouchableOpacity
            key={t.value}
            style={getStyle(type === t.value)}
            onPress={() =>
              onFilterChange({ type: t.value as "all" | "income" | "expense" })
            }
          >
            <Text style={getTextStyle(type === t.value)}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtro por Categoria */}
      <Text style={styles.label}>Categoria:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={`${cat}-${index}`} // ✅ chave única
            style={getStyle(category === cat)}
            onPress={() =>
              onFilterChange({ category: cat === "Todas" ? "all" : cat })
            }
          >
            <Text style={getTextStyle(category === cat)}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15, // Espaço extra no final para rolar
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TransactionFilter;
