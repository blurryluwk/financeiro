import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem("@users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Verifica se o e-mail já existe
      const userExists = users.some((user: any) => user.email === email);
      if (userExists) {
        Alert.alert("Erro", "E-mail já cadastrado!");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      await AsyncStorage.setItem("@users", JSON.stringify(users));

      await AsyncStorage.setItem("@user", JSON.stringify(newUser)); // mantém logado

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar o usuário.");
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome..."
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite seu email..."
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite uma senha..."
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
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
