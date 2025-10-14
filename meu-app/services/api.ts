import { getToken } from "./auth";

const API_BASE_URL = "http://192.168.1.119:3000/api"; // ajuste conforme seu backend

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  tokenParam?: string
) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    // Se não foi passado token, busca do SecureStore
    const token = tokenParam || (await getToken());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Pode haver respostas sem JSON (ex: 204 No Content)
    let data: any = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || `Erro ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error("API Request Error:", err);
    throw err;
  }
}
