import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/auth"; // função no auth.ts

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    console.log("📝 Tentando registrar usuário...");
    console.log("📤 Dados enviados:", { name, email, password });

    setLoading(true);

    try {
      const newUser = await registerUser({ name, email, password });
      console.log("✅ Usuário registrado com sucesso:", newUser);

      Alert.alert("Sucesso", "Cadastro realizado!", [
        {
          text: "OK",
          onPress: () => {
            console.log("🔁 Redirecionando para /tabs");
            router.replace("/(tabs)");
          },
        },
      ]);
    } catch (error: any) {
      console.error("🔥 Erro ao registrar:", error);

      // Caso o backend retorne erro de e-mail já existente
      if (error.message.includes("409") || error.message.includes("unique")) {
        Alert.alert("Erro", "E-mail já cadastrado!");
      } else if (error.message.includes("Network request failed")) {
        Alert.alert(
          "Erro de Conexão",
          "Não foi possível conectar ao servidor. Verifique se o backend está rodando e acessível via IP."
        );
      } else {
        Alert.alert(
          "Erro",
          error.message || "Não foi possível cadastrar o usuário."
        );
      }
    } finally {
      setLoading(false);
      console.log("🕓 Processo de registro finalizado.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="rgba(0,0,0,0.4)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="rgba(0,0,0,0.4)"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="rgba(0,0,0,0.4)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.link}>Já tem uma conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 30 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 20, color: "#007AFF" },
});
