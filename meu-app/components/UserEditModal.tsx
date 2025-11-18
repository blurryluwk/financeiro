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
import { updateUser } from "@/services/auth";
import { getProfilePicture, uploadProfilePicture } from "@/services/photo";
import Colors from "@/constants/Colors";

type UserEditModalProps = {
    visible: boolean;
    onClose: () => void;
    user: { id: string; name: string | null };
    setUserName: (name: string) => void;
    setProfileImage: (uri: string) => void;
    profileImageUrl?: string | null;
};

export default function UserEditModal({
    visible,
    onClose,
    user,
    setUserName,
    setProfileImage,
    profileImageUrl = null,
}: UserEditModalProps) {
    const [name, setName] = useState(user.name || "");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Carrega nome e foto do usuário sempre que o modal abre ou o user muda
    useEffect(() => {
        setName(user.name || "");
        setImageUri(null);

        const loadProfileImage = async () => {
            try {
                const base64Image = await getProfilePicture();
                if (base64Image) setImageUri(base64Image);
            } catch (err) {
                console.error("Erro ao buscar foto atual:", err);
            }
        };

        if (visible) loadProfileImage();
    }, [user, visible]);

    // Função para fechar modal
    const handleClose = () => {
        // 🔹 Atualiza a foto do layout com a foto atual ou upload recente
        if (imageUri) setProfileImage(imageUri);
        setImageUri(null);
        onClose();
    };

    // Seleção de imagem
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset.uri) setImageUri(asset.uri);
            }
        } catch (error) {
            console.error("Erro ao selecionar imagem:", error);
            Alert.alert("Erro", "Não foi possível selecionar a imagem.");
        }
    };

    // Salvar alterações
    const handleSave = async () => {
        const newName = name.trim();
        const currentName = user.name?.trim();

        if (!newName) {
            Alert.alert("Atenção", "O nome não pode estar vazio.");
            return;
        }

        setLoading(true);
        try {
            // 🔹 Upload de imagem se houve alteração
            if (imageUri && !imageUri.startsWith("data:image")) {
                const uploaded = await uploadProfilePicture(user.id, imageUri);
                if (uploaded.url) setImageUri(uploaded.url);
            }

            // 🔹 Atualiza o nome se mudou
            if (newName !== currentName) {
                const updatedUser = await updateUser({ userId: user.id, name: newName });
                if (updatedUser.name) setUserName(updatedUser.name);
            }

            handleClose();
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
                                imageUri
                                    ? { uri: imageUri }
                                    : profileImageUrl
                                        ? { uri: profileImageUrl }
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
                        placeholder="Seu nome"
                    />

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
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
