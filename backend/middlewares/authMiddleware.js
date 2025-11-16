import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Chave secreta deve ser carregada do ambiente
const JWT_SECRET = process.env.JWT_SECRET || "zzzdefault_secret"; 

/**
 * @desc Middleware para proteger rotas.
 * Verifica o token JWT e injeta o userId no objeto req.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Checa se o token está presente no cabeçalho Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extrai o token do formato "Bearer [token]"
      token = req.headers.authorization.split(" ")[1];

      // 2. Decodifica o token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. Busca o usuário no banco de dados (pelo ID do token)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true }, // Retorna apenas dados seguros
      });

      if (!user) {
        console.log("⚠️ Token válido, mas usuário não encontrado:", decoded.id);
        return res.status(401).json({ error: "Usuário não autorizado (token inválido)" });
      }

      // 4. ✅ Anexa o ID do usuário ao objeto de requisição (req)
      // O controller poderá acessar o ID assim: req.userId
      req.userId = user.id;

      // Continua para o próximo middleware/controlador
      next();
      
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        console.error("🔥 Erro JWT: Token malformado ou inválido.");
        return res.status(401).json({ error: "Token não autorizado." });
      }
      if (error.name === 'TokenExpiredError') {
        console.error("🔥 Erro JWT: Token expirado.");
        return res.status(401).json({ error: "Token expirado." });
      }
      console.error("🔥 Erro no middleware de autenticação:", error);
      return res.status(500).json({ error: "Erro interno de autenticação." });
    }
  }

  // 5. Se não houver token no cabeçalho
  if (!token) {
    return res.status(401).json({ error: "Não autorizado, nenhum token fornecido." });
  }
};