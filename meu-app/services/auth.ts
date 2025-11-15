// services/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

//  LOGIN
export async function login(email: string, password: string) {
  const response = await apiRequest("/users/login", "POST", { email, password });

  if (!response?.token || !response?.user) {
    throw new Error("Resposta inválida do servidor");
  }

  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, response.token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user)),
  ]);

  return response.user;
}

// LOGOUT
export async function logout() {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}

// PEGAR TOKEN
export async function getToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error("Erro ao obter token:", err);
    return null;
  }
}

// 🔹 PEGAR USUÁRIO
export async function getUser() {
  try {
    const storedUser = await AsyncStorage.getItem(USER_KEY);
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
    AsyncStorage.setItem(TOKEN_KEY, response.token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user)),
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
