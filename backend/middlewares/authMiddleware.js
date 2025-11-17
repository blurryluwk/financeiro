import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Obter o cabeçalho Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Token não fornecido ou formato inválido." });
  }

  // 2. Extrair o Token
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificar e Decodificar o Token
    // SUBSTITUA 'SUA_CHAVE_SECRETA_AQUI' pela chave que você usou para assinar o token
    const decoded = jwt.verify(token, 'zzz');

    // 4. Anexar o userId à requisição
    req.userId = decoded.id; 
    
    // Passa para a próxima função (o seu controller)
    next(); 
  } catch (error) {
    // Falha na verificação (token expirado, chave errada, etc.)
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

export default authMiddleware;