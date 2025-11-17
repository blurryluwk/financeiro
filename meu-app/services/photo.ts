// services/photo.ts
import { Platform } from "react-native";
import { apiRequest } from "./api"; // Assumindo que apiRequest está em './api'

type UploadResponse = {
  url?: string;
};

export async function uploadProfilePicture(userId: string, uri: string): Promise<UploadResponse> {
  try {
    // 🔹 Certifica que uri é string
    if (typeof uri !== "string") throw new Error("URI inválida");

    // 🔹 Extrai o nome do arquivo
    const uriParts = uri.split("/");
    const fileName = uriParts[uriParts.length - 1];

    // 🔹 Descobre o tipo MIME básico a partir da extensão
    const fileExt = fileName.split(".").pop()?.toLowerCase();
    let mimeType = "image/jpeg";
    if (fileExt === "png") mimeType = "image/png";

    // 🔹 Cria objeto para envio via FormData
    const formData = new FormData();
    
    // Adiciona a imagem ao FormData
    formData.append("photo", {
      uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      name: fileName,
      type: mimeType,
    } as any);

    // 🔹 Faz o POST para a API usando apiRequest
    const endpoint = `/profile-pictures`;
    
    const data = await apiRequest(
      endpoint,
      "POST",
      formData, // O body é o FormData
      undefined,
    );

    // data já é o JSON parseado retornado pelo servidor
    return { url: data.url }; 
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    throw error;
  }
}