import { getToken } from "./auth";

const API_BASE_URL = "http://localhost:3000/api"; // ajuste conforme seu backend

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  token?: string
) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    // Pega token do storage se não passou
    if (!token) {
      token = (await getToken()) || undefined;
    }

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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `Erro ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error("API Request Error:", err);
    throw err;
  }
}
