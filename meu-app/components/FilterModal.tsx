// /components/Filters/FilterModal.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { FilterState } from "./TransactionFilter";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  // O filtro ATUAL vindo da tela principal
  currentFilter: FilterState;
  // Função para aplicar o filtro e fechar o modal
  onApply: (filter: FilterState) => void;
  availableCategories: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  currentFilter,
  onApply,
  availableCategories,
}) => {
  // Estado local para gerenciar as seleções ANTES de aplicar o filtro
  const [tempFilter, setTempFilter] = useState<FilterState>(currentFilter);

  // Sincroniza o estado local quando o modal for aberto
  useEffect(() => {
    if (isVisible) {
      setTempFilter(currentFilter);
    }
  }, [isVisible, currentFilter]);

  const types = [
    { label: "Todas", value: "all" },
    { label: "Receitas", value: "income" },
    { label: "Despesas", value: "expense" },
  ];

  // Categorias para o modal (inclui 'all')
  const categories = ["Todas", ...availableCategories];

  const getStyle = (isActive: boolean) => ({
    ...styles.button,
    backgroundColor: isActive ? "#4695a0ff" : "#f0f0f0",
  });

  const getTextStyle = (isActive: boolean) => ({
    ...styles.buttonText,
    color: isActive ? "#fff" : "#333",
  });

  const handleApply = () => {
    onApply(tempFilter); // Aplica o filtro na tela principal
    onClose();
  };

  const handleReset = () => {
    setTempFilter({ type: "all", category: "all" });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filtrar Transações</Text>

          {/* Filtro por Tipo */}
          <Text style={styles.label}>Tipo de Transação:</Text>
          <View style={styles.rowContainer}>
            {types.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={getStyle(tempFilter.type === t.value)}
                onPress={() =>
                  setTempFilter((p) => ({
                    ...p,
                    type: t.value as "all" | "income" | "expense",
                  }))
                }
              >
                <Text style={getTextStyle(tempFilter.type === t.value)}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Filtro por Categoria */}
          <Text style={styles.label}>Categoria:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowContainer}
          >
            {categories.map((cat, index) => {
              const categoryValue = cat === "Todas" ? "all" : cat;
              const isSelected = tempFilter.category === categoryValue;

              return (
                <TouchableOpacity
                  key={`${cat}-${index}`} // ✅ chave única
                  style={getStyle(isSelected)}
                  onPress={() =>
                    setTempFilter((p) => ({ ...p, category: categoryValue }))
                  }
                >
                  <Text style={getTextStyle(isSelected)}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Botões de Ação */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Aplicar Filtro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ... Estilos (abaixo)

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end", // Alinha o modal na parte inferior
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Escurece o fundo
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%", // limita a altura do modal
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resetButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  resetButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#4695a0ff",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FilterModal;
