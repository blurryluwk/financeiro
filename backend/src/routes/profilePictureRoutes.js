import express from "express";
import ProfilePictureController from "../controllers/profilePictureController.js";
import { protect } from "../../middlewares/authMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

// Função wrapper para capturar erros do Multer (como limite de arquivo)
const multerErrorHandler = (req, res, next) => {
  // Middleware Multer
  upload.single("photo")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Erros específicos do Multer (e.g., FILE_TOO_LARGE)
      console.error("🔥 Erro Multer:", err.message);
      return res.status(400).json({ error: `Erro no upload: ${err.message}` });
    } else if (err) {
      // Outros erros gerais (e.g., do fileFilter)
      console.error("🔥 Erro de Upload Geral:", err.message);
      return res.status(400).json({ error: err.message });
    }
    // Se não houver erro, passa para o próximo middleware
    next();
  });
};

// 1. Rota de Upload (POST)
router.post(
  "/upload",
  protect, // 1. Autentica
  multerErrorHandler, // 2. ✅ Captura o arquivo E TRATA ERROS DO MULTER
  ProfilePictureController.uploadPhoto // 3. Executa a lógica do controlador
);

// 2. Rota GET
router.get("/me", protect, ProfilePictureController.getPhoto);

export default router;