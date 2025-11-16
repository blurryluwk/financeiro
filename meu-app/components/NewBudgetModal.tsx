import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { getUser } from "@/services/auth";
import { apiRequest } from "@/services/api";

type Category = {
    id: number;
    name: string;
};

type AddBudgetModalProps = {
    visible: boolean;
    onClose: () => void;
    onAdd: (data: { user_id: number; category_id: number; amount: number }) => Promise<void>;
};

export default function AddBudgetModal({ visible, onClose, onAdd }: AddBudgetModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [amount, setamount] = useState("");
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        if (!visible) return;

        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const user = await getUser();
                if (!user?.id) return;

                const data: Category[] = await apiRequest(`/categories?userId=${user.id}`, "GET");
                setCategories(data);
                setSelectedCategoryId(data[0]?.id || null);
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
                setCategories([]);
                setSelectedCategoryId(null);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
        setamount("");
    }, [visible]);

    const handleAdd = async () => {
        const user = await getUser();
        if (!user?.id) {
            Alert.alert("Erro", "Usuário inválido.");
            return;
        }

        if (!selectedCategoryId) {
            Alert.alert("Erro", "Selecione uma categoria.");
            return;
        }

        const amountValue = Number(amount);
        if (!amount.trim() || isNaN(amountValue)) {
            Alert.alert("Erro", "Informe um valor válido.");
            return;
        }

        try {
            await onAdd({
                user_id: Number(user.id),
                category_id: Number(selectedCategoryId),
                amount: amountValue,
            });
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Falha ao adicionar orçamento:", {
                    message: error.message,
                    stack: error.stack
                });
            } else {
                console.error("Falha ao adicionar orçamento (erro desconhecido):", error);
            }

            Alert.alert(
                "Erro",
                "Não foi possível salvar o orçamento. Verifique sua conexão e tente novamente."
            );
        }


    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Adicionar Orçamento</Text>

                    {loadingCategories ? (
                        <ActivityIndicator size="small" color="#4695a0" style={{ marginVertical: 20 }} />
                    ) : (
                        <>
                            <Text style={{ marginBottom: 8 }}>Categoria:</Text>
                            <ScrollView horizontal style={{ marginBottom: 12 }}>
                                {categories.map((cat) => (
                                    <Pressable
                                        key={cat.id}
                                        onPress={() => setSelectedCategoryId(cat.id)}
                                        style={[
                                            styles.categoryButton,
                                            selectedCategoryId === cat.id && styles.categoryButtonSelected,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryButtonText,
                                                selectedCategoryId === cat.id && styles.categoryButtonTextSelected,
                                            ]}
                                        >
                                            {cat.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>

                            <TextInput
                                placeholder="Orçamento (R$)"
                                style={styles.input}
                                value={amount}
                                onChangeText={setamount}
                                keyboardType="numeric"
                            />

                            <View style={styles.modalButtons}>
                                <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </Pressable>

                                <Pressable style={[styles.button, styles.addButton]} onPress={handleAdd}>
                                    <Text style={styles.buttonText}>Adicionar</Text>
                                </Pressable>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "85%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#333",
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: "#eee",
        marginRight: 8,
    },
    categoryButtonSelected: {
        backgroundColor: "#4695a0",
    },
    categoryButtonText: {
        color: "#333",
        fontWeight: "bold",
    },
    categoryButtonTextSelected: {
        color: "white",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    addButton: {
        backgroundColor: "#4695a0",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
