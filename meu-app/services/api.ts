import { getToken } from "./auth";

const LOCAL_IP = "192.168.1.124";
const LOCAL_PORT = 3000;

const API_BASE_URL = "http://" + LOCAL_IP + `:${LOCAL_PORT}/api`;

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  tokenParam?: string
) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // 🔐 Recupera token JWT (se disponível)
    const token = tokenParam || (await getToken());

    // 🔧 Monta cabeçalhos
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    // ⚙️ Configurações da requisição
    const options: RequestInit = {
      method,
      headers,
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    };

    // 🛰️ Log detalhado da requisição
    console.log("🌐 Enviando requisição:");
    console.log("➡️ URL:", url);
    console.log("➡️ Método:", method);
    if (body) console.log("➡️ Corpo:", body);
    if (token) console.log("🔑 Token enviado:", token.slice(0, 10) + "...");

    // Envia a requisição
    const response = await fetch(url, options);

    // Lê resposta (mesmo se não for JSON)
    const text = await response.text();
    let data: any = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    // Log da resposta
    console.log("📥 Resposta recebida:");
    console.log("📊 Status:", response.status);
    console.log("📦 Dados:", data);

    // Erro HTTP
    if (!response.ok) {
      const message =
        data?.error || `Erro ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    // Retorna dados
    return data;
  } catch (err: any) {
    console.error("🚨 Erro em apiRequest:", err.message || err);
    throw err;
  }
}
