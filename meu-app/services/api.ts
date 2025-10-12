const BASE_URL = "https://localhost:3000/transactions";

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any
) {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ${response.status}: ${errorText}`);
  }

  return await response.json();
}
