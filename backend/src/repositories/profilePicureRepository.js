import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @desc Insere ou atualiza (upsert) a foto de perfil do usuário.
 * @param {number} userId - ID do usuário.
 * @param {Buffer} photoBuffer - Dados binários (BYTEA) da imagem.
 */
export async function upsertPhoto({ userId, photoBuffer }) {
  // Converte o ID para Int para garantir a compatibilidade com o schema.prisma
  const idAsInt = parseInt(userId); 

  return await prisma.profilePicture.upsert({
    where: { user_id: idAsInt },
    update: { photo: photoBuffer, uploaded_at: new Date() },
    create: { 
      user_id: idAsInt, 
      photo: photoBuffer 
    },
    // Seleciona campos para retorno, mantendo o padrão das outras funções
    select: { user_id: true, uploaded_at: true },
  });
}

/**
 * @desc Busca a foto de perfil de um usuário pelo ID.
 * @param {number} userId - ID do usuário.
 */
export async function findByUserId(userId) {
  // Converte o ID para Int
  const idAsInt = parseInt(userId);

  return await prisma.profilePicture.findUnique({
    where: { user_id: idAsInt },
    // Seleciona apenas o buffer da foto e o ID para o Controller
    select: { photo: true, user_id: true, uploaded_at: true } 
  });
}

// Opcional, se precisar deletar a foto de perfil
/**
 * @desc Deleta a foto de perfil de um usuário pelo ID.
 * @param {number} userId - ID do usuário.
 */
export async function deleteByUserId(userId) {
  const idAsInt = parseInt(userId);

  return await prisma.profilePicture.delete({
    where: { user_id: idAsInt },
  });
}