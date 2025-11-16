// services/photo.ts
import { apiRequest } from "./api"; // importa função genérica

export const uploadProfilePhoto = async (payload: { userId: string; base64: string }) => {
  try {
    // Chama a API passando endpoint, método e corpo
    const data = await apiRequest(`/profile_photos/${payload.userId}`, "POST", {
      image: payload.base64,
    });

    // Retorna o objeto com a imagem base64
    return data; // { image: "...base64..." }
  } catch (err) {
    console.error("🚨 Erro ao enviar foto de perfil:", err);
    throw err;
  }
};
