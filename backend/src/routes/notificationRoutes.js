// src/routes/notificationRoutes.js
import express from "express";
import NotificationController from "../controllers/notificationController.js";
import authMiddleware from "../../middlewares/authMiddleware.js"; 

const router = express.Router();

// Rota para listar todas as notificações do usuário logado
// GET /notifications?page=1&pageSize=10
// Necessita de autenticação para obter o ID do usuário (req.userId)
router.get("/", 
    authMiddleware, 
    NotificationController.listNotifications
);

// marcar uma ou mais notificações como lidas
router.put("/read", 
    authMiddleware, 
    NotificationController.markAsRead
);

export default router;