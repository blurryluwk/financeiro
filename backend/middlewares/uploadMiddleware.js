// src/middlewares/uploadMiddleware.js

import multer from 'multer';

const storage = multer.memoryStorage(); 

const upload = multer({
  storage: storage,
  limits: {
    // Define um limite máximo para o tamanho do arquivo (ex: 5MB)
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    // Filtra para aceitar apenas imagens (opcional, mas recomendado)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
  }
});

export default upload;