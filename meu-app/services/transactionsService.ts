import { getUser } from "@/services/auth";
import { apiRequest } from "@/services/api";

export async function fetchTransactions() {
  const user = await getUser();
  if (!user?.id) throw new Error("Usuário não logado");

  return await apiRequest(`/transactions?userId=${user.id}`, "GET");
}