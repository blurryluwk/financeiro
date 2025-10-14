// services/auth.ts
import { apiRequest } from "./api";
import * as SecureStore from "expo-secure-store";

// Detecta se está rodando no web
const isWeb = typeof window !== "undefined" && !window.navigator?.product?.includes("ReactNative");

// Wrapper de storage compatível web + mobile
const storage = {
  setItem: async (key: string, value: string) => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string) => {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  removeItem: async (key: string) => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// -------------------------
// Login
// -------------------------
export async function login(email: string, password: string) {
  const response = await apiRequest("/users/login", "POST", { email, password });
  console.log("Login response raw:", response);

  if (!response?.token || !response?.user) {
    throw new Error("Resposta inválida do servidor");
  }

  await storage.setItem("token", response.token);
  await storage.setItem("user", JSON.stringify(response.user));

  return response.user;
}

// -------------------------
// Registro
// -------------------------
export async function registerUser(name: string, email: string, password: string) {
  const response = await apiRequest("/users/register", "POST", { name, email, password });
  console.log("Register response raw:", response);

  if (!response?.token || !response?.user) {
    throw new Error("Resposta inválida do servidor");
  }

  await storage.setItem("token", response.token);
  await storage.setItem("user", JSON.stringify(response.user));

  return response.user;
}

// -------------------------
// Logout
// -------------------------
export async function logout() {
  await storage.removeItem("token");
  await storage.removeItem("user");
}

// -------------------------
// Pegar token ou usuário
// -------------------------
export async function getToken() {
  return await storage.getItem("token");
}

export async function getUser() {
  const user = await storage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// -------------------------
// Requisição autenticada
// -------------------------
export async function authRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) {
  const token = await getToken();
  if (!token) throw new Error("Usuário não autenticado");

  return await apiRequest(endpoint, method, body, token);
}

// -------------------------
// Verifica autenticação
// -------------------------
export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}
