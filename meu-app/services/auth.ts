// services/auth.ts
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "./api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

// 🔹 LOGIN
export async function login(email: string, password: string) {
  const response = await apiRequest("/users/login", "POST", { email, password });

  if (!response?.token || !response?.user) {
    throw new Error("Resposta inválida do servidor");
  }

  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, response.token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user)),
  ]);

  return response.user;
}

// 🔹 LOGOUT
export async function logout() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}

// 🔹 PEGAR TOKEN
export async function getToken() {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (err) {
    console.error("Erro ao obter token:", err);
    return null;
  }
}

// 🔹 PEGAR USUÁRIO
export async function getUser() {
  try {
    const storedUser = await SecureStore.getItemAsync(USER_KEY);
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch (err) {
    console.error("Erro ao obter usuário:", err);
    return null;
  }
}

// 🔹 REGISTRO DE USUÁRIO
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await apiRequest("/users/register", "POST", data);

  if (!response?.token || !response?.user) {
    throw new Error("Resposta inválida do servidor ao registrar");
  }

  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, response.token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user)),
  ]);

  return response.user;
}

// 🔹 REQUISIÇÃO AUTENTICADA
export async function authRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("Token não encontrado. Usuário não autenticado.");
    }

    // Faz requisição usando o token
    return await apiRequest(endpoint, method, body, token);
  } catch (err) {
    console.error("Erro no authRequest:", err);
    throw err;
  }
}
