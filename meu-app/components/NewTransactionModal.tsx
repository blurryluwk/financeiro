import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/services/api"; 

export type NewTransactionData = {
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

interface NewTransactionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: NewTransactionData) => void;
  availableCategories?: string[]; 
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categories, setCategories] = useState<string[]>(["Outros"]);
  const [category, setCategory] = useState("Outros");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const userJson = await AsyncStorage.getItem("@user");
        if (!userJson) return;
        const user = JSON.parse(userJson);

        const data = await apiRequest(`/categories?userId=${user.id}`, "GET");
        if (data.length > 0) {
          setCategories(data.map((c: any) => c.name));
          setCategory(data[0].name);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    loadCategories();
  }, []);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!description || parsedAmount <= 0 || isNaN(parsedAmount)) {
      Alert.alert("Erro", "Preencha a descrição e um valor válido.");
      return;
    }

    const newTransaction: NewTransactionData = {
      description,
      amount: parsedAmount,
      type,
      category,
      date: currentDate,
    };

    onSave(newTransaction);
    onClose();
  };

  const currentDate = new Date().toISOString().split("T")[0];
  // Buscar categorias do usuário no backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        // Supondo que você tem o usuário logado no AsyncStorage
        const userJson = await AsyncStorage.getItem("@user");
        if (!userJson) return;

        const user = JSON.parse(userJson);
        const data = await apiRequest(`/categories?userId=${user.id}`, "GET");
        if (data.length > 0) {
          setCategories(data.map((c: any) => c.name));
          setCategory(data[0].name);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <Modal animationType="slide" transparent visible={isVisible}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Nova Transação</Text>

          {/* Tipo */}
          <Text style={styles.label}>Tipo:</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              onPress={() => setType("expense")}
              style={[
                styles.typeButton,
                { backgroundColor: type === "expense" ? "#de1d6aff" : "#eee" },
              ]}
            >
              <Text style={{ color: type === "expense" ? "#fff" : "#333" }}>
                Despesa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType("income")}
              style={[
                styles.typeButton,
                { backgroundColor: type === "income" ? "#8fccb6ff" : "#eee" },
              ]}
            >
              <Text style={{ color: type === "income" ? "#fff" : "#333" }}>
                Receita
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categoria */}
          <Text style={styles.label}>Categoria:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: category === cat ? "#4695a0ff" : "#f0f0f0",
                  },
                ]}
              >
                <Text style={{ color: category === cat ? "#fff" : "#333" }}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Descrição */}
          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Mercado, Salário..."
            value={description}
            onChangeText={setDescription}
          />

          {/* Valor */}
          <Text style={styles.label}>Valor (R$):</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.dateText}>Data: {currentDate}</Text>

          {/* Botões */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 45,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  typeButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  categoryScrollContainer: { flexDirection: "row", marginBottom: 15 },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  cancelButtonText: { color: "#333", fontWeight: "bold" },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#4695a0ff",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
});

export default NewTransactionModal;
