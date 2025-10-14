import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/services/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      // 👇 Log dos dados que estão sendo enviados
      console.log("📤 Enviando dados de login:", { email, password });

      const user = await login(email, password);

      // 👇 Log do retorno completo
      console.log("✅ Resposta do backend:", user);

      if (!user?.id) {
        console.warn("⚠️ Usuário retornado inválido:", user);
        setError("Usuário inválido. Contate o suporte.");
        return;
      }

      console.log("🎉 Login bem-sucedido! Redirecionando...");
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("❌ Erro ao fazer login:", err);

      // 👇 Log completo do erro (mensagem e stack se houver)
      console.log("🧩 Detalhes do erro:", {
        message: err.message,
        stack: err.stack,
      });

      setError(
        err.message.includes("401")
          ? "E-mail ou senha incorretos"
          : err.message.includes("404")
            ? "Usuário não encontrado"
            : err.message.includes("Network")
              ? "Falha de conexão com o servidor"
              : err.message || "Erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazer login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
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
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
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
