// services/photo.ts
import { Platform } from "react-native";
import { apiRequest } from "./api";
import { getToken } from "./auth";

// ----------------------
// Converte Blob → Base64
// ----------------------
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ----------------------
// Upload da foto
// ----------------------
export async function uploadProfilePicture(
  userId: string,
  uri: string
): Promise<{ url?: string }> {
  try {
    if (typeof uri !== "string") throw new Error("URI inválida");

    const uriParts = uri.split("/");
    const fileName = uriParts[uriParts.length - 1];

    const fileExt = fileName.split(".").pop()?.toLowerCase();
    let mimeType = "image/jpeg";
    if (fileExt === "png") mimeType = "image/png";

    const formData = new FormData();

    formData.append("photo", {
      uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      name: fileName,
      type: mimeType,
    } as any);

    const data = await apiRequest(
      "/profile-pictures",
      "POST",
      formData,
      undefined,
      "json" // continua como antes
    );

    return { url: data.url };
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    throw error;
  }
}

// ----------------------
// Buscar foto do usuário logado (/me)
// ----------------------
export async function getProfilePicture(): Promise<string | null> {
  try {
    const token = await getToken();
    if (!token) return null;

    // 1. Baixa o binário
    const blob = await apiRequest(
      "/profile-pictures/me",
      "GET",
      undefined,
      token,
      "blob" // 👈 agora apiRequest sabe lidar
    );

    // 2. Converte Blob → Base64
    const base64 = await blobToBase64(blob);

    return base64; // data:image/jpeg;base64,...
  } catch (error) {
    console.error("Erro ao buscar foto:", error);
    return null;
  }
}
