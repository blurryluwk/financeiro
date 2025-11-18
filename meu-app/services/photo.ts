// services/photo.ts
import { Platform } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
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
// Compressão automática da imagem
// ----------------------
async function compressImage(uri: string, quality = 0.6): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(uri, [], {
    compress: quality,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return result.uri;
}

// ----------------------
// Upload da foto com retry
// ----------------------
export async function uploadProfilePicture(
  userId: string,
  uri: string,
  retries = 2
): Promise<{ url?: string }> {
  try {
    if (typeof uri !== "string") throw new Error("URI inválida");

    // 🔹 Comprime imagem
    const compressedUri = await compressImage(uri);

    // 🔹 Extrai informações do arquivo
    const uriParts = compressedUri.split("/");
    const fileName = uriParts[uriParts.length - 1];
    const fileExt = fileName.split(".").pop()?.toLowerCase();
    let mimeType = "image/jpeg";
    if (fileExt === "png") mimeType = "image/png";

    // 🔹 Cria FormData
    const formData = new FormData();
    formData.append("photo", {
      uri: Platform.OS === "ios" ? compressedUri.replace("file://", "") : compressedUri,
      name: fileName,
      type: mimeType,
    } as any);

    console.log("📤 Enviando foto para API:", { userId, fileName, mimeType });

    // 🔹 Faz requisição
    const data = await apiRequest("/profile-pictures", "POST", formData);

    console.log("✅ Upload concluído:", data);

    return { url: data.url };
  } catch (error: any) {
    console.error("🚨 Erro no upload da imagem:", error.message || error);

    if (retries > 0) {
      console.log("⏳ Tentando novamente upload... Restam tentativas:", retries);
      return uploadProfilePicture(userId, uri, retries - 1);
    }

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
    const blob = await apiRequest("/profile-pictures/me", "GET", undefined, token, "blob");

    // 2. Converte Blob → Base64
    const base64 = await blobToBase64(blob);

    return base64; // data:image/jpeg;base64,...
  } catch (error) {
    console.error("🚨 Erro ao buscar foto:", error);
    return null;
  }
}
