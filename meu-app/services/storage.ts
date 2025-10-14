import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (user: any) => {
  try {
    await AsyncStorage.setItem("@user", JSON.stringify(user));
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
  }
};

export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem("@user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Erro ao ler usuário:", error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem("@user");
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
  }
};
