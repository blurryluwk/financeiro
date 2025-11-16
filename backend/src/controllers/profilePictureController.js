import ProfilePictureService from "../services/profilePictureService.js";

const ProfilePictureController = {
  /**
   * @desc Faz o upload ou substitui a foto de perfil do usuário.
   * @route POST /api/photos/upload
   * @access Private (via middleware de autenticação)
   */
  uploadPhoto: async (req, res) => {
    const userId = req.userId;
    const file = req.file; // Obtido via middleware de upload (ex: multer)
    
    if (!userId) {
      console.log("⚠️ Falha de autorização: userId ausente no token.");
      return res.status(401).json({ error: "Usuário não autenticado." });
    }
    
    if (!file || !file.buffer) {
      console.log("⚠️ Falha na validação: Nenhuma imagem ou buffer de arquivo encontrado.");
      return res.status(400).json({ error: "Nenhum arquivo de imagem fornecido." });
    }

    try {
      console.log(`📩 Requisição para upload de foto: User ID ${userId}, Tamanho: ${file.size} bytes`);

      // O serviço recebe o ID do usuário (do token) e o buffer da imagem
      const updatedPhoto = await ProfilePictureService.uploadPhoto(userId, file.buffer);

      console.log("✅ Foto de perfil atualizada com sucesso.");
      
      // Retorna a confirmação e o timestamp de upload (pode ser o próprio buffer se necessário)
      return res.status(200).json({ 
        message: "Foto de perfil atualizada com sucesso.",
        uploaded_at: updatedPhoto.uploaded_at,
        user_id: updatedPhoto.user_id
      });
      
    } catch (error) {
      console.error("🔥 Erro no upload de foto:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Erro interno ao processar a foto." });
    }
  },

  /**
   * @desc Obtém a foto de perfil do usuário logado.
   * @route GET /api/photos/me
   * @access Private (via middleware de autenticação)
   */
  getPhoto: async (req, res) => {
    const userId = req.userId; // ID obtido do token JWT
    
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      console.log(`📩 Requisição para obter foto: User ID ${userId}`);
      
      const photoRecord = await ProfilePictureService.getPhoto(userId);

      if (!photoRecord || !photoRecord.photo) {
        console.log("⚠️ Foto não encontrada para o ID:", userId);
        return res.status(404).json({ error: "Foto de perfil não encontrada." });
      }

      // Configura os cabeçalhos para enviar a imagem binária (Buffer/BYTEA)
      // Assumindo que o formato é JPEG, ajuste conforme necessário (PNG, etc.)
      res.setHeader('Content-Type', 'image/jpeg'); 
      res.setHeader('Content-Length', photoRecord.photo.length); 

      console.log("✅ Foto de perfil enviada com sucesso.");
      
      // Envia o buffer binário diretamente
      return res.send(photoRecord.photo); 
      
    } catch (error) {
      console.error("🔥 Erro ao obter foto:", error);
      return res
        .status(error.status || 500)
        .json({ error: error.message || "Erro interno ao buscar a foto." });
    }
  }
};

export default ProfilePictureController;