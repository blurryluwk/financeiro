import ProfilePictureService from "../services/profilePictureService.js";

const ProfilePictureController = {

  uploadPhoto: async (req, res) => {
    const userId = req.userId;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (!file || !file.buffer) {
      return res.status(400).json({ error: "Nenhum arquivo de imagem fornecido." });
    }

    try {
      console.log(`📩 Upload de foto: User ID ${userId}, Tamanho: ${file.size} bytes`);

      const updatedPhoto = await ProfilePictureService.uploadPhoto(
        userId,
        file.buffer
      );

      console.log("✅ Foto de perfil atualizada.");

      // ✔️ Ajuste mínimo: retornar a rota EXISTENTE
      return res.status(200).json({
        message: "Foto de perfil atualizada com sucesso.",
        uploaded_at: updatedPhoto.uploaded_at,
        user_id: updatedPhoto.user_id,
        url: "/profile-pictures/me"   // <-- Correção: esta rota existe
      });

    } catch (error) {
      console.error("🔥 Erro no upload de foto:", error);
      return res.status(error.status || 500).json({
        error: error.message || "Erro interno ao processar a foto."
      });
    }
  },

  getPhoto: async (req, res) => {
    const userId = req.userId; // ✔️ 'me' não usa params.id

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      console.log(`📩 Buscando foto para User ID ${userId}`);

      const photoRecord = await ProfilePictureService.getPhoto(userId);

      if (!photoRecord || !photoRecord.photo) {
        console.log("⚠️ Foto não encontrada:", userId);
        return res.status(404).json({ error: "Foto de perfil não encontrada." });
      }

      // ✔️ JPEG por padrão
      res.setHeader("Content-Type", "image/jpeg");

      console.log("✅ Foto enviada como binário.");
      return res.send(photoRecord.photo);

    } catch (error) {
      console.error("🔥 Erro ao obter foto:", error);
      return res.status(error.status || 500).json({
        error: error.message || "Erro interno ao buscar a foto."
      });
    }
  }
};

export default ProfilePictureController;
