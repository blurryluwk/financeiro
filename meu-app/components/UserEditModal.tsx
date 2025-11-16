import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateUser } from "@/services/auth"; // função que envia dados
import Colors from "@/constants/Colors";
// import { uploadProfilePicture } from "@/services/photo"; // Função de upload removida/comentada

type UserEditModalProps = {
    visible: boolean;
    onClose: () => void;
    // O tipo 'user' não precisa ter 'profileImage' se o modal não o utiliza.
    user: { id: string; name: string | null };
    // CORREÇÃO DE TIPAGEM: Mantido como (name: string) => void,
    // mas agora garantimos que o handleSave o chama corretamente.
    setUserName: (name: string) => void;
    // O setProfileImage não será chamado, mas mantido na interface se o componente pai o espera
    setProfileImage: (uri: string) => void;
};

export default function UserEditModal({
    visible,
    onClose,
    user,
    setUserName,
    setProfileImage, // Mantido, mas não será usado no handleSave
}: UserEditModalProps) {
    const [name, setName] = useState(user.name || "");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Atualiza o estado sempre que o 'user' muda
    useEffect(() => {
        setName(user.name || "");
        setImageUri(null);
        setImageBase64(null);
    }, [user]);

    // Função para selecionar uma imagem
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets[0].uri) {
                setImageUri(result.assets[0].uri);
                setImageBase64(result.assets[0].base64 || null);
            }
        } catch (error) {
            console.error("Erro ao selecionar imagem:", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        }
    };

    // Função para salvar as alterações no perfil
    const handleSave = async () => {
        const newName = name.trim();
        const currentName = user.name?.trim();

        // 1. 🛑 Validação Inicial: Verifica se o nome está vazio ou se não houve alteração.
        if (!newName) {
            Alert.alert("Atenção", "O nome não pode estar vazio.");
            return;
        }

        if (newName === currentName) {
            Alert.alert("Atenção", "Nenhuma alteração de nome para salvar.");
            onClose();
            return;
        }

        setLoading(true);
        try {
            // 2. ✅ Atualiza o nome via API (updateUser usará apiRequest)
            const updatedUser = await updateUser({
                userId: user.id,
                name: newName, // Usamos newName que já está trimado
            });

            // 3. ✨ Atualiza o estado no componente pai (conforme o tipo string)
            if (updatedUser.name) {
                setUserName(updatedUser.name);
            }

            onClose(); // Fecha o modal após o sucesso
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            Alert.alert("Erro", "Não foi possível atualizar o usuário.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Editar Perfil</Text>

                    <TouchableOpacity onPress={pickImage} style={{ alignItems: "center" }}>
                        <Image
                            source={
                                // Se imageUri existir (foi selecionado), use-o.
                                // Caso contrário, você deve usar a foto de perfil do estado 'user'
                                // (que não está sendo passado aqui, então vamos manter o default)
                                imageUri
                                    ? { uri: imageUri }
                                    : require("@/assets/images/default-profile.jpg")
                            }
                            style={styles.profileImage}
                        />
                        <Text style={styles.changePhotoText}>Alterar foto</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder={user.name || "Seu nome"}
                    />

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Salvar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// Estilos
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#ccc",
    },
    changePhotoText: {
        marginTop: 5,
        color: Colors.light.tint,
        fontWeight: "500",
        textAlign: "center",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginTop: 15,
    },
    buttons: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    saveButton: {
        backgroundColor: Colors.light.tint,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});