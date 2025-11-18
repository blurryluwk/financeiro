import { getToken } from "./auth";

const API_BASE_URL = `https://unsubmergible-overpolemical-eddy.ngrok-free.dev/api`;

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  tokenParam?: string,
  responseType: "json" | "text" | "blob" = "json"   // 🔥 ADICIONADO
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = body instanceof FormData;

  try {
    const token = tokenParam || (await getToken());

    const headers: Record<string, string> = {};
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    const options: RequestInit = {
      method,
      headers,
      body:
        body && method !== "GET"
          ? isFormData
            ? body
            : JSON.stringify(body)
          : undefined,
    };

    console.log("🌐 Enviando requisição:");
    console.log("➡️ URL:", url);
    console.log("➡️ Método:", method);
    if (body) console.log("➡️ Corpo:", isFormData ? "[FormData]" : body);
    if (token) console.log("🔑 Token enviado:", token.slice(0, 10) + "...");

    const response = await fetch(url, options);

    // SE RESPONSE TYPE FOR BLOB → RETORNA DIRETO
    if (responseType === "blob") {
      const blob = await response.blob();
      if (!response.ok) throw new Error("Erro ao baixar blob");
      return blob;
    }

    // Continua como antes (text + parse JSON)
    const text = await response.text();
    let data: any = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    console.log("📥 Resposta recebida:");
    console.log("📊 Status:", response.status);
    console.log("📦 Dados:", data);

    if (!response.ok) {
      const message =
        data?.error || `Erro ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return data;
  } catch (err: any) {
    console.error("🚨 Erro em apiRequest:", err.message || err);
    throw err;
  }
}
