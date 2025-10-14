// services/auth.ts
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "./api";

// -------------------------
// Storage wrapper usando apenas SecureStore
// -------------------------
const storage = {
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

// -------------------------
// Login
// -------------------------
export async function login(email: string, password: string) {
  const response = await apiRequest("/users/login", "POST", { email, password });

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
export async function getToken(): Promise<string | undefined> {
  const token = await storage.getItem("token");
  return token || undefined;
}

export async function getUser(): Promise<{ id: number; name: string; email: string } | null> {
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

  return await apiRequest(endpoint, method, body, token); // apiRequest deve aceitar token
}

// -------------------------
// Verifica autenticação
// -------------------------
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return !!token;
}
