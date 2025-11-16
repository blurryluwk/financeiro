import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ProfilePictureService = {

  /**
   * @desc Insere ou atualiza o registro de foto de perfil.
   * O upload é um 'upsert' (update ou insert).
   * @param {number} userId - ID do usuário.
   * @param {Buffer} photoBuffer - Dados binários (BYTEA) da imagem.
   */
  uploadPhoto: async (userId, photoBuffer) => {
    // Verifica se o ID é um número (embora o controller já deve garantir isso)
    const idAsInt = parseInt(userId);

    if (isNaN(idAsInt)) {
      throw { status: 400, message: "ID de usuário inválido." };
    }

    try {
      // Usamos upsert: se o registro com user_id existir, ele atualiza; senão, ele cria.
      const updatedPhoto = await prisma.profilePicture.upsert({
        where: { user_id: idAsInt },
        update: { photo: photoBuffer, uploaded_at: new Date() },
        create: { 
          user_id: idAsInt, 
          photo: photoBuffer 
        },
        select: { user_id: true, uploaded_at: true }, // Retorna apenas metadados
      });

      return updatedPhoto;
      
    } catch (error) {
      console.error("Erro no ProfilePictureService.uploadPhoto:", error);
      // Se for uma chave estrangeira inválida (usuário não existe), o Prisma lança P2003
      if (error.code === 'P2003') {
         throw { status: 404, message: "Usuário associado à foto não encontrado." };
      }
      throw { status: 500, message: "Falha ao salvar a foto de perfil." };
    }
  },

  /**
   * @desc Obtém o registro da foto de perfil pelo ID do usuário.
   * @param {number} userId - ID do usuário.
   */
  getPhoto: async (userId) => {
    const idAsInt = parseInt(userId);

    if (isNaN(idAsInt)) {
      throw { status: 400, message: "ID de usuário inválido." };
    }

    try {
      const photoRecord = await prisma.profilePicture.findUnique({
        where: { user_id: idAsInt },
        select: { photo: true, user_id: true } // Seleciona apenas o buffer e o ID
      });

      if (!photoRecord) {
        throw { status: 404, message: "Foto de perfil não encontrada." };
      }
      
      return photoRecord;

    } catch (error) {
      // Evita retornar 500 para um erro 404 (tratado acima)
      if (error.status === 404) throw error; 
      
      console.error("Erro no ProfilePictureService.getPhoto:", error);
      throw { status: 500, message: "Falha ao buscar a foto de perfil." };
    }
  },
};

export default ProfilePictureService;