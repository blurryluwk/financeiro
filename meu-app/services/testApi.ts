// src/services/testApi.ts
import { apiRequest } from "./api";

export async function testApi() {
  const endpoints = ["/users", "/transactions", "/categories"];

  for (const endpoint of endpoints) {
    try {
      const data = await apiRequest(endpoint);
      console.log(`✅ ${endpoint}:`, data);
    } catch (error: any) {
      console.error(`❌ ${endpoint} failed:`, error.message);
    }
  }
}
