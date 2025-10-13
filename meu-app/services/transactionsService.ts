import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "@/services/api";

export async function fetchTransactions() {
  const userData = await AsyncStorage.getItem("@user");
  const userId = userData ? JSON.parse(userData).id : null;

  if (!userId) throw new Error("Usuário não logado");

  return await apiRequest(`/transactions?userId=${userId}`);
}
