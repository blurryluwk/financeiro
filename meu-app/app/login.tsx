import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 estado para mensagens de erro

  async function handleLogin() {
    setError(""); // limpa mensagem anterior

    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem("@users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find((u: any) => u.email === email);

      if (!user) {
        setError("Usuário inexistente! Crie uma conta.");
        return;
      }

      if (user.password !== password) {
        setError("Senha incorreta!");
        return;
      }

      await AsyncStorage.setItem("@user", JSON.stringify(user));

      router.replace("/(tabs)");
    } catch (error) {
      setError("Ocorreu um erro inesperado. Tente novamente.");
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazer login</Text>

      {/* 🟥 Mensagem de erro na tela */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Digite seu email..."
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha..."
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorText: {
    color: "#ff3b30",
    marginBottom: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#007AFF",
  },
});
