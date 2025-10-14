import { getToken } from "./auth";

const API_BASE_URL = "http://192.168.1.119:3000/api";

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  tokenParam?: string
) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = tokenParam || (await getToken());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const options: RequestInit = {
      method,
      headers,
      // ✅ Só envia body se houver conteúdo E o método for diferente de GET
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(url, options);

    // Tenta decodificar resposta
    const text = await response.text();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      throw new Error(data?.error || `Erro ${response.status}: ${text}`);
    }

    return data;
  } catch (err) {
    console.error("API Request Error:", err);
    throw err;
  }
}
